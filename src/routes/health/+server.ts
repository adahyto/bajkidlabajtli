import { json } from '@sveltejs/kit';
import { channelStatus, getChannel } from '$lib/server/youtube';
import type { RequestHandler } from './$types';

const startedAt = Date.now();

/** GET /health — the app is up, and what it last read from YouTube (deploy checks and CI wait for it) */
export const GET: RequestHandler = async () => {
	await getChannel();
	return json(
		{
			status: 'ok',
			startedAt: new Date(startedAt).toISOString(),
			uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
			node: process.version,
			channel: channelStatus()
		},
		{ headers: { 'cache-control': 'no-store' } }
	);
};
