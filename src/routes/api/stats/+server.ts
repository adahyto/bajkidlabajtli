import { allowCount, count, isRobot, isTest, sourceOf, viewKey } from '$lib/server/stats';
import { getChannel } from '$lib/server/youtube';
import type { RequestHandler } from './$types';

/*
 * A page seen, told by the browser (lib/stats.ts), as the server does not see the pages Cloudflare answers for:
 * counted without anything about the visitor (lib/server/stats.ts). Only the path of a page the site has is
 * counted (a song of the channel, not any address); on the first page of a visit also where it came from, as a kind. One of our own checks counts as
 * test:<key>.
 * POST { event: 'view', path, from?, utm? } -> 204, also when the address went past its limit (then nothing is
 * counted). `from` is the host of the referring site and `utm` the page's utm_source, both only on a first page.
 */
export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
	const body = await request.json().catch(() => null);
	if (!body || body.event !== 'view' || typeof body.path !== 'string')
		return new Response(null, { status: 400 });
	const view = viewKey(body.path, await getChannel());
	if (view && !isRobot(request.headers.get('user-agent')) && allowCount(getClientAddress)) {
		const test = isTest(request, getClientAddress);
		count(view, test);
		if (typeof body.from === 'string' && typeof body.utm === 'string')
			count(sourceOf(body.from.slice(0, 253), body.utm.slice(0, 100), url.hostname), test);
	}
	return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
};
