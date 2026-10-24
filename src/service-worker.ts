/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

/*
 * The site as an app, also without the internet (SvelteKit registers this file by itself):
 * - the code, fonts, icons and pictures of the site are kept for each version (cache-first: their names change with
 *   their content, or they change only with a version);
 * - pages (and their data for moves inside the site) come from the network first, so a new song shows at once;
 *   without the network the last copy kept, and for a page never opened /offline. The home page, the mode for a
 *   child and the page for parents are kept from the start;
 * - pictures of the videos are kept as they are seen, the newest 60, and refreshed in the background.
 * Nothing else: not YouTube (its videos cannot play without the internet), not the statistics, /health or robots.
 * A new version takes over at once and the old copies go. The copies hold nothing about the visitor (/prywatnosc).
 * To take the app out of browsers that have it, deploy tools/service-worker-off.js in this file's place.
 */

const sw = self as unknown as ServiceWorkerGlobalScope;

const APP = `app-${version}`;
const PAGES = `pages-${version}`;
const PICTURES = 'pictures';
const MAX_PICTURES = 60;

/** The site's own files kept from the start; not the IndexNow key, the picture for sharing or the screenshots */
const ASSETS = [
	...build,
	...files.filter((f) => !/\.txt$|^\/udostepnij\.png$|^\/screenshots\//.test(f))
];
const START_PAGES = ['/', '/dziecko', '/dla-rodzicow'];
const OFFLINE = '/offline';

sw.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			await (await caches.open(APP)).addAll(ASSETS);
			const pages = await caches.open(PAGES);
			await pages.add(OFFLINE);
			// A page that does not answer now is kept when it is opened
			await Promise.allSettled(START_PAGES.map((p) => pages.add(p)));
			await sw.skipWaiting();
		})()
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys())
				if (key !== APP && key !== PAGES && key !== PICTURES) await caches.delete(key);
			await sw.clients.claim();
		})()
	);
});

/** The newest pictures stay; Cache Storage keeps them in the order they were put */
async function trim(cache: Cache) {
	const keys = await cache.keys();
	for (const key of keys.slice(0, Math.max(0, keys.length - MAX_PICTURES))) await cache.delete(key);
}

async function fromNetworkFirst(request: Request, navigation: boolean): Promise<Response> {
	const pages = await caches.open(PAGES);
	try {
		const response = await fetch(request);
		if (response.status === 200) await pages.put(request, response.clone());
		return response;
	} catch {
		const kept = await pages.match(request, { ignoreSearch: navigation });
		if (kept) return kept;
		if (navigation) return (await pages.match(OFFLINE)) ?? Response.error();
		return Response.error();
	}
}

async function picture(request: Request, event: FetchEvent): Promise<Response> {
	const cache = await caches.open(PICTURES);
	const kept = await cache.match(request);
	const fresh = fetch(request).then(async (response) => {
		if (response.status === 200) {
			await cache.put(request, response.clone());
			await trim(cache);
		}
		return response;
	});
	if (kept) {
		event.waitUntil(fresh.catch(() => {}));
		return kept;
	}
	return fresh;
}

sw.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;
	const url = new URL(request.url);
	if (url.origin !== sw.location.origin) return;
	const path = url.pathname;
	if (ASSETS.includes(path)) {
		event.respondWith(
			caches
				.open(APP)
				.then((cache) => cache.match(path))
				.then((kept) => kept ?? fetch(request))
		);
	} else if (path.startsWith('/miniatura/')) {
		event.respondWith(picture(request, event));
	} else if (request.mode === 'navigate' || path.endsWith('/__data.json')) {
		event.respondWith(fromNetworkFirst(request, request.mode === 'navigate'));
	}
	// Everything else (statistics, /health, robots.txt, the sitemap) goes to the network as without this worker
});
