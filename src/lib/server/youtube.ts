import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';
import type { Channel, Playlist, Video } from '$lib/types';
import {
	fullIdByTitle,
	fullIdOf,
	isShort,
	parseDescription,
	seconds,
	slugify,
	splitTitle
} from './description';
import { newPages, tellSearchEngines } from './indexnow';

/*
 * The channel's videos and playlists, read from YouTube on the server, so that a new song shows on the site by itself.
 * The YouTube Data API (YOUTUBE_API_KEY, the key of ldb-api, which Google lets in from this server only) gives
 * lengths and playlists; without a key, or when it fails before anything was read, the channel's RSS feed gives the
 * last 15 videos without them. Read at most every 30 minutes, when a page asks: the visitor gets what was read
 * before and the new read happens meanwhile, ~5 units of the 10 000 a day. The last good read is kept in
 * DATA_DIR/channel.json (a Docker volume), so the site has its songs at once after a deploy, also while YouTube does
 * not answer. CHANNEL_FIXTURE (tests) is a file to read instead of YouTube.
 */

export const CHANNEL_ID = env.CHANNEL_ID || 'UC49z2jaN67oRj1nHtkT6UbA';
const REFRESH_MS = 30 * 60 * 1000;
// After a failed read, the next try waits this long
const RETRY_MS = 5 * 60 * 1000;
const API = 'https://www.googleapis.com/youtube/v3';

const file = () => join(env.DATA_DIR || '.data', 'channel.json');

let current: Channel | null = null;
let fromDisk = false;
let reading: Promise<Channel | null> | null = null;
let lastTry = 0;
let lastError = '';
const quota = { day: '', units: 0 };

const EMPTY: Channel = { videos: [], playlists: [], updated: '', source: 'api' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

async function api(path: string, params: Record<string, string>): Promise<Json> {
	const url = new URL(`${API}/${path}`);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	url.searchParams.set('key', env.YOUTUBE_API_KEY ?? '');
	const today = new Date().toISOString().slice(0, 10);
	if (quota.day !== today) Object.assign(quota, { day: today, units: 0 });
	quota.units++;
	const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
	// The address holds the key: never in a message
	if (!res.ok) {
		const reason = await res
			.json()
			.then((b: Json) => b?.error?.errors?.[0]?.reason ?? b?.error?.status ?? '')
			.catch(() => '');
		throw new Error(`YouTube API ${path}: ${res.status} ${reason}`.trim());
	}
	return res.json();
}

function video(
	id: string,
	fullTitle: string,
	description: string,
	published: string,
	length: number,
	tags: string[] = []
): Video {
	const { title, subtitle } = splitTitle(fullTitle);
	const short = isShort(fullTitle, description, tags);
	return {
		id,
		title,
		subtitle,
		fullTitle,
		description,
		published,
		seconds: length,
		short,
		slug: '',
		parents: parseDescription(description, fullTitle),
		...(short && fullIdOf(description) ? { fullId: fullIdOf(description) } : {})
	};
}

async function fromApi(): Promise<Channel> {
	// The playlist of all uploads: the channel's id with UU for UC
	const uploads = `UU${CHANNEL_ID.slice(2)}`;
	const ids: string[] = [];
	let pageToken = '';
	for (let page = 0; page < 4; page++) {
		const list = await api('playlistItems', {
			part: 'contentDetails',
			playlistId: uploads,
			maxResults: '50',
			...(pageToken ? { pageToken } : {})
		});
		for (const item of list.items ?? []) ids.push(item.contentDetails.videoId);
		pageToken = list.nextPageToken ?? '';
		if (!pageToken) break;
	}
	const videos: Video[] = [];
	for (let i = 0; i < ids.length; i += 50) {
		const list = await api('videos', {
			part: 'snippet,contentDetails,status',
			id: ids.slice(i, i + 50).join(',')
		});
		for (const v of list.items ?? []) {
			// Only what anyone may watch, here on the site: public, playable in a frame, not a coming premiere
			if (v.status?.privacyStatus !== 'public' || v.status?.embeddable === false) continue;
			if (v.snippet?.liveBroadcastContent && v.snippet.liveBroadcastContent !== 'none') continue;
			videos.push(
				video(
					v.id,
					v.snippet.title,
					v.snippet.description ?? '',
					v.snippet.publishedAt,
					seconds(v.contentDetails?.duration ?? ''),
					v.snippet.tags ?? []
				)
			);
		}
	}
	const known = new Set(videos.map((v) => v.id));
	const playlists: Playlist[] = [];
	const lists = await api('playlists', {
		part: 'snippet,contentDetails,status',
		channelId: CHANNEL_ID,
		maxResults: '50'
	});
	for (const p of lists.items ?? []) {
		if (p.status?.privacyStatus !== 'public' || !p.contentDetails?.itemCount) continue;
		const items = await api('playlistItems', {
			part: 'contentDetails',
			playlistId: p.id,
			maxResults: '50'
		});
		const videoIds = (items.items ?? [])
			.map((item: Json) => item.contentDetails.videoId as string)
			.filter((id: string) => known.has(id));
		if (videoIds.length)
			playlists.push({
				id: p.id,
				title: p.snippet.title,
				description: p.snippet.description ?? '',
				slug: '',
				videoIds
			});
	}
	return finish({ videos, playlists, updated: new Date().toISOString(), source: 'api' });
}

const xmlText = (text: string) =>
	text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');

/** The RSS feed of the channel: the last 15 videos, without lengths; playlists stay as last read */
async function fromRss(): Promise<Channel> {
	const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
		signal: AbortSignal.timeout(10_000)
	});
	if (!res.ok) throw new Error(`YouTube RSS: ${res.status}`);
	return finish({
		videos: parseFeed(await res.text()),
		playlists: current?.playlists ?? [],
		updated: new Date().toISOString(),
		source: 'rss'
	});
}

export function parseFeed(xml: string): Video[] {
	return xml
		.split('<entry>')
		.slice(1)
		.map((entry) => {
			const tag = (name: string) =>
				xmlText(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(entry)?.[1] ?? '');
			return video(
				tag('yt:videoId'),
				tag('title'),
				tag('media:description'),
				tag('published'),
				// What was read with the API before still knows the length
				current?.videos.find((v) => v.id === tag('yt:videoId'))?.seconds ?? 0
			);
		})
		.filter((v) => /^[\w-]{11}$/.test(v.id));
}

/**
 * Addresses for the songs and playlists, the oldest first, so that a new one never takes an address someone may
 * have saved; a short's full song only when it is on the channel; the newest first
 */
export function finish(channel: Channel): Channel {
	const byAge = [...channel.videos].sort((a, b) => a.published.localeCompare(b.published));
	const taken = new Set<string>();
	const unique = (base: string, kind: string) => {
		let slug = base;
		for (let n = 2; taken.has(`${kind}/${slug}`); n++) slug = `${base}-${n}`;
		taken.add(`${kind}/${slug}`);
		return slug;
	};
	for (const v of byAge)
		v.slug = unique(slugify(v.title) || v.id.toLowerCase(), v.short ? 'krotka' : 'piosenka');
	for (const p of channel.playlists) p.slug = unique(slugify(p.title) || p.id.toLowerCase(), 'p');
	const ids = new Set(channel.videos.map((v) => v.id));
	const songs = channel.videos.filter((v) => !v.short);
	for (const v of channel.videos) {
		if (v.fullId && !ids.has(v.fullId)) delete v.fullId;
		// A short out before its song, its description not yet linking it: the song with its title
		if (v.short && !v.fullId) {
			const fullId = fullIdByTitle(v, songs);
			if (fullId) v.fullId = fullId;
		}
	}
	channel.videos.sort((a, b) => b.published.localeCompare(a.published));
	return channel;
}

async function save(channel: Channel): Promise<void> {
	await mkdir(join(file(), '..'), { recursive: true });
	const part = `${file()}.${process.pid}.part`;
	await writeFile(part, JSON.stringify(channel), { mode: 0o600 });
	await rename(part, file());
}

async function read(): Promise<Channel | null> {
	lastTry = Date.now();
	try {
		const channel = env.YOUTUBE_API_KEY ? await fromApi() : await fromRss();
		const before = current;
		current = channel;
		// A new song: search engines that read IndexNow hear of it now (lib/server/indexnow.ts)
		if (env.INDEXING === '1' && env.ORIGIN?.startsWith('https://'))
			tellSearchEngines(env.ORIGIN, newPages(before, channel));
		lastError = '';
		await save(channel).catch((e) => console.error('channel.json not written', e));
		console.log(
			`channel read (${channel.source}): ${channel.videos.length} videos, ${channel.playlists.length} playlists`
		);
		return channel;
	} catch (e) {
		lastError = e instanceof Error ? e.message : String(e);
		console.error(`channel not read: ${lastError}`);
		// Nothing at all yet: the feed, at least the newest videos
		if (!current && env.YOUTUBE_API_KEY) {
			current = await fromRss().catch(() => null);
		}
		return current;
	}
}

/** The channel as last read; reads again in the background when it is older than 30 minutes */
export async function getChannel(): Promise<Channel> {
	if (env.CHANNEL_FIXTURE) {
		current ??= finish(JSON.parse(await readFile(env.CHANNEL_FIXTURE, 'utf8')) as Channel);
		return current;
	}
	if (!current && !fromDisk) {
		fromDisk = true;
		const saved = await readFile(file(), 'utf8').catch(() => '');
		try {
			// Again through finish(), so that what a new version links (a short to its song) shows at once
			if (saved) current = finish(JSON.parse(saved) as Channel);
		} catch {
			console.error('channel.json is not valid JSON; reading YouTube again');
		}
	}
	const age = current ? Date.now() - Date.parse(current.updated) : Infinity;
	if (!reading && !(age < REFRESH_MS) && Date.now() - lastTry > (current ? RETRY_MS : 60_000)) {
		reading = read().finally(() => (reading = null));
	}
	if (!current && reading) await reading;
	return current ?? EMPTY;
}

/** For /health */
export function channelStatus() {
	return {
		source: current?.source ?? null,
		updated: current?.updated ?? null,
		videos: current?.videos.length ?? 0,
		playlists: current?.playlists.length ?? 0,
		apiKey: !!env.YOUTUBE_API_KEY,
		unitsToday: quota.day === new Date().toISOString().slice(0, 10) ? quota.units : 0,
		lastError
	};
}
