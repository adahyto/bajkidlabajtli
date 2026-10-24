import { error } from '@sveltejs/kit';
import { getChannel } from '$lib/server/youtube';
import { thumb, type Size } from '$lib/server/thumbs';
import type { RequestHandler } from './$types';

/** GET /miniatura/<video id>-<m|h|l|s>.jpg: the picture of a video of the channel, from this server (lib/server/thumbs.ts) */
export const GET: RequestHandler = async ({ params }) => {
	const m = /^([\w-]{11})-(m|h|l|s)\.jpg$/.exec(params.file);
	if (!m) error(404, 'Nie ma takiego obrazka');
	const channel = await getChannel();
	if (!channel.videos.some((v) => v.id === m[1])) error(404, 'Nie ma takiego obrazka');
	const data = await thumb(m[1], m[2] as Size);
	if (!data) error(404, 'Nie ma takiego obrazka');
	return new Response(data as BodyInit, {
		headers: {
			'content-type': 'image/jpeg',
			// A day in browsers and Cloudflare: a new picture from the channel shows by the next day
			'cache-control': 'public, max-age=86400'
		}
	});
};
