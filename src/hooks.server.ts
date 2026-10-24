import type { Handle, ServerInit } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { pruneStats } from '$lib/server/stats';
import { getChannel } from '$lib/server/youtube';

export const init: ServerInit = () => {
	// The songs read before (DATA_DIR/channel.json) or from YouTube, before the first visitor asks
	getChannel().catch((e) => console.error('channel', e));
	// Months of statistics older than 13 go (lib/server/stats.ts): at start and then once a day
	const sweep = () =>
		pruneStats()
			.then((n) => n && console.log(`${n} months of stats deleted`))
			.catch((e) => console.error('stats cleanup failed', e));
	sweep();
	setInterval(sweep, 24 * 60 * 60 * 1000).unref();
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	// Powerful browser features the pages never use stay off; the YouTube frame gets autoplay and full screen
	// from its allow attribute
	response.headers.set(
		'permissions-policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'
	);
	// Out of search results until launch (INDEXING=1 in .env); robots.txt says the same
	if (env.INDEXING !== '1') response.headers.set('x-robots-tag', 'noindex');
	// A page is the same for everyone (no cookies, the CSP by hash). Browsers ask again every time, so a new song
	// shows at once; Cloudflare may keep a page ten minutes if a Cache Rule there says so. Pages are counted by the
	// browser (lib/stats.ts), not here.
	if (
		event.request.method === 'GET' &&
		response.status === 200 &&
		(response.headers.get('content-type') ?? '').startsWith('text/html') &&
		!response.headers.has('cache-control')
	)
		response.headers.set('cache-control', 'public, max-age=0, s-maxage=600');
	return response;
};
