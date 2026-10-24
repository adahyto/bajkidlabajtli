import { read } from '$app/server';
import ico from '$lib/assets/favicon.ico';
import type { RequestHandler } from './$types';

/*
 * GET /favicon.ico (48, 32, 16 px), with its type: from static/ it went out with an empty Content-Type, as the server
 * of static files does not know .ico, and with nosniff a browser or Google may not take it for an icon
 */
export const GET: RequestHandler = () =>
	new Response(read(ico).body, {
		headers: { 'content-type': 'image/x-icon', 'cache-control': 'public, max-age=86400' }
	});
