import { GUIDES } from '$lib/guides';
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';
import type { Channel } from '$lib/types';

/*
 * Statistics without cookies, as on urlhub (src/lib/server/stats.ts there): sums per day, nothing about who. A page
 * seen and where the visit came from, as a kind (a search engine, ChatGPT, a social site…, never the address). The
 * address of a visitor is never stored and the browser keeps nothing; the address only counts against a limit in
 * memory, so that nobody inflates the numbers. Counted in memory and written once a minute to
 * DATA_DIR/stats/<YYYY-MM>.json (a Docker volume); months older than 13 are deleted once a day. /prywatnosc says the
 * same.
 *
 * Keys: view:<path> for the home page, /dla-rodzicow, /dziecko, /poradnik, /prywatnosc, each guide and each song,
 * short and playlist of the channel, src:<kind>.
 * Our own checks and load tests are not visitors: their counts go to test:<key> instead (isTest), as on urlhub.
 */

type Day = Record<string, number>;
type Month = Record<string, Day>;

const KEEP_MONTHS = 13;
// Outside Docker the counts go to .data/ (not in git)
const folder = () => join(env.DATA_DIR || '.data', 'stats');
const months = new Map<string, Month>();
const dirty = new Set<string>();

async function monthOf(month: string): Promise<Month> {
	let data = months.get(month);
	if (data) return data;
	const raw = await readFile(join(folder(), `${month}.json`), 'utf8').catch(() => '');
	try {
		data = raw ? (JSON.parse(raw) as Month) : {};
	} catch {
		console.error(`stats/${month}.json is not valid JSON; counting from zero`);
		data = {};
	}
	// Another call may have loaded it meanwhile
	data = months.get(month) ?? data;
	months.set(month, data);
	return data;
}

/** One more of a key today */
export async function bump(key: string, now = new Date()): Promise<void> {
	const day = now.toISOString().slice(0, 10);
	const month = day.slice(0, 7);
	const data = await monthOf(month);
	const counts = (data[day] ??= {});
	counts[key] = (counts[key] ?? 0) + 1;
	dirty.add(month);
}

/** Fire and forget: a count never holds up an answer; one of our tests goes to test:<key> */
export const count = (key: string | null | undefined, test = false) => {
	if (key) bump(test ? `test:${key}` : key).catch((e) => console.error('stats', e));
};

/** A whole file or none: written aside, then put in place */
async function writeWhole(file: string, content: string): Promise<void> {
	const part = `${file}.${process.pid}.part`;
	await writeFile(part, content, { mode: 0o600 });
	await rename(part, file);
}

export async function flush(): Promise<void> {
	if (!dirty.size) return;
	await mkdir(folder(), { recursive: true });
	for (const month of [...dirty]) {
		dirty.delete(month);
		await writeWhole(join(folder(), `${month}.json`), JSON.stringify(months.get(month) ?? {}));
	}
}

const timer = setInterval(
	() => flush().catch((e) => console.error('writing stats failed', e)),
	Number(env.STATS_FLUSH_MS) || 60_000
);
timer.unref?.();
// adapter-node says so before it stops (a deploy): the last minute is written too
process.on('sveltekit:shutdown', () => void flush());

/** Months older than KEEP_MONTHS go; returns how many */
export async function pruneStats(now = new Date()): Promise<number> {
	const oldest = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - KEEP_MONTHS + 1, 1))
		.toISOString()
		.slice(0, 7);
	const names = await readdir(folder()).catch(() => [] as string[]);
	let deleted = 0;
	for (const name of names) {
		const month = /^(\d{4}-\d{2})\.json$/.exec(name)?.[1];
		if (month && month < oldest) {
			await rm(join(folder(), name), { force: true });
			months.delete(month);
			deleted++;
		}
	}
	return deleted;
}

// Programs that do not count as visitors: crawlers, link previews of messengers, monitors, headless browsers
const ROBOTS =
	/bot\b|bot\/|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|slack|skype|vkshare|embedly|curl|wget|python|httpx|axios|node-fetch|undici|go-http|java\/|headless|lighthouse|pingdom|uptime|monitor/i;
export const isRobot = (userAgent: string | null) => !userAgent || ROBOTS.test(userAgent);

// Load and test tools, as they name themselves
const TEST_TOOLS =
	/apachebench|\bwrk\b|\bhey\b|\bk6\b|siege|jmeter|locust|autocannon|\boha\b|vegeta|bombardier/i;
const testAddresses = () =>
	new Set(
		(env.TEST_ADDRESSES ?? '')
			.split(',')
			.map((a) => a.trim().toLowerCase())
			.filter(Boolean)
	);

/**
 * A request of our own checks or load tests rather than of a visitor: the header "X-Doner-Test: 1", a load tool in
 * the User-Agent, or an address in TEST_ADDRESSES (this server's own: a check from here through the domain arrives
 * with them, also a browser run from here, whose page tells of itself). The address is only compared, in memory,
 * as for the limit below.
 */
export function isTest(request: Request, address: () => string): boolean {
	if (request.headers.get('x-doner-test') === '1') return true;
	if (TEST_TOOLS.test(request.headers.get('user-agent') ?? '')) return true;
	try {
		return testAddresses().has(
			address()
				.toLowerCase()
				.replace(/^::ffff:/, '')
		);
	} catch {
		// No address (a request on this host, without Apache's X-Forwarded-For): allowCount counts nothing anyway
		return false;
	}
}

const FIXED = new Set(['/', '/dla-rodzicow', '/dziecko', '/poradnik', '/prywatnosc']);
const ROUTE = /^\/(piosenka|krotka|playlista|poradnik)\/([a-z0-9-]{1,90})$/;

/** The page an address is, as a key (each song and playlist apart), or null for what is not counted */
export function viewKey(pathname: string, channel: Channel): string | null {
	const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
	if (FIXED.has(path)) return `view:${path}`;
	const m = ROUTE.exec(path);
	if (!m) return null;
	const known =
		m[1] === 'poradnik'
			? GUIDES.some((g) => g.slug === m[2])
			: m[1] === 'playlista'
				? channel.playlists.some((p) => p.slug === m[2])
				: channel.videos.some((v) => v.slug === m[2] && v.short === (m[1] === 'krotka'));
	return known ? `view:${path}` : null;
}

const SOURCES: [RegExp, string][] = [
	[/(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$/, 'chatgpt'],
	[/(^|\.)perplexity\.ai$/, 'perplexity'],
	[/(^|\.)claude\.ai$/, 'claude'],
	[/^gemini\.google\.com$/, 'gemini'],
	[/^copilot\.microsoft\.com$/, 'copilot'],
	[
		/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|yandex\.[a-z]+|ecosia\.org|startpage\.com|qwant\.com|search\.brave\.com)$/,
		'search'
	],
	[
		/(^|\.)(facebook\.com|fb\.com|instagram\.com|t\.co|x\.com|twitter\.com|linkedin\.com|lnkd\.in|reddit\.com|wykop\.pl|whatsapp\.com|t\.me|telegram\.org|messenger\.com|discord\.com|youtube\.com|tiktok\.com|pinterest\.[a-z]+)$/,
		'social'
	],
	// The other sites of doner.cloud, which link here
	[
		/(^|\.)(doner\.cloud|slonce\.info\.pl|kosmos\.info\.pl|zodiak\.info\.pl|przodkowie\.info\.pl|urlhub\.cloud|rezerwi\.pl)$/,
		'doner'
	]
];

/**
 * Where a visit came from, as a kind: the host of the referring site, as the browser tells it on the first page
 * of a visit (lib/stats.ts; looked at, not kept), or the utm_source some assistants add; null when it came from
 * this site itself
 */
export function sourceOf(fromHost: string, utmSource: string, ownHost: string): string | null {
	const utm = utmSource.toLowerCase();
	if (utm) {
		for (const [pattern, kind] of SOURCES) if (pattern.test(utm)) return `src:${kind}`;
	}
	const host = fromHost.toLowerCase().replace(/^www\./, '');
	if (!host) return 'src:direct';
	if (host === ownHost.replace(/^www\./, '')) return null;
	for (const [pattern, kind] of SOURCES) if (pattern.test(host)) return `src:${kind}`;
	return 'src:other';
}

/**
 * A limit of counts per visitor address and minute. The address is kept in memory only, never stored, and
 * forgotten when its minute is over, as /prywatnosc says.
 */
export function perMinuteLimit(max: number): (address: string, now?: number) => boolean {
	const recent = new Map<string, number[]>();
	setInterval(() => {
		const now = Date.now();
		for (const [address, times] of recent) {
			if (times.every((t) => now - t >= 60_000)) recent.delete(address);
		}
	}, 60_000).unref();
	return (address, now = Date.now()) => {
		const times = (recent.get(address) ?? []).filter((t) => now - t < 60_000);
		if (times.length >= max) {
			recent.set(address, times);
			return false;
		}
		times.push(now);
		recent.set(address, times);
		if (recent.size > 10_000) recent.clear();
		return true;
	};
}

const allow = perMinuteLimit(120);

/**
 * Pages counted per visitor address and minute, opened or reached inside the site. Without the address (a request
 * on this host, without Apache's X-Forwarded-For, which adapter-node then refuses) nothing is counted.
 */
export function allowCount(address: () => string): boolean {
	try {
		return allow(address());
	} catch {
		return false;
	}
}
