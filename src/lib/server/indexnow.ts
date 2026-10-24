import type { Channel } from '../types.ts';

/*
 * Search engines that read IndexNow (Bing, Yandex, Seznam and others; Google does not) hear of a new song at once:
 * when a read of the channel (lib/server/youtube.ts) finds a video the last one did not have. Its page, the home
 * page and /dla-rodzicow, which show it. Only after launch (INDEXING=1), from the public address (ORIGIN), and not
 * after the first read ever, which has nothing to compare with. The key is static/<key>.txt. Only the addresses of
 * the site's pages go out. No imports beyond types: tests/unit runs newPages in plain Node.
 */

export const INDEXNOW_KEY = '41105b3b4a3cc4831930e468c4056496';
// A video older than this is not new, only newly seen (e.g. the API back after the RSS feed's 15)
const NEW_DAYS = 7;

/** The pages to tell about: of each new video the page search engines should have (a short's full song's) */
export function newPages(before: Channel | null, after: Channel, now = Date.now()): string[] {
	if (!before?.videos.length) return [];
	const known = new Set(before.videos.map((v) => v.id));
	const fresh = after.videos.filter(
		(v) => !known.has(v.id) && now - Date.parse(v.published) < NEW_DAYS * 24 * 60 * 60 * 1000
	);
	if (!fresh.length) return [];
	const pathOf = (v: { short: boolean; slug: string }) =>
		`/${v.short ? 'krotka' : 'piosenka'}/${v.slug}`;
	const paths = fresh.map((v) => {
		const full = v.fullId ? after.videos.find((f) => f.id === v.fullId) : undefined;
		return pathOf(full ?? v);
	});
	return [...new Set([...paths, '/', '/dla-rodzicow'])];
}

/** Sends the addresses; a failure is only logged */
export async function tellSearchEngines(origin: string, paths: string[]): Promise<void> {
	if (!paths.length) return;
	const host = new URL(origin).host;
	try {
		const res = await fetch('https://api.indexnow.org/indexnow', {
			method: 'POST',
			headers: { 'content-type': 'application/json; charset=utf-8' },
			body: JSON.stringify({
				host,
				key: INDEXNOW_KEY,
				keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
				urlList: paths.map((p) => `${origin}${p}`)
			}),
			signal: AbortSignal.timeout(10_000)
		});
		console.log(`IndexNow: ${paths.length} addresses, answer ${res.status}`);
	} catch (e) {
		console.error('IndexNow not told', e);
	}
}
