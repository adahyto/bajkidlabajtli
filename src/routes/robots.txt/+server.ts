import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// Until launch (INDEXING=1 in docker-compose.yaml) search engines and AI crawlers are asked to stay away; after
// it every page is open, with the sitemap. Kept five minutes at most: without a cache-control of its own, Cloudflare
// kept the closed one four hours after a launch (zodiak.info.pl, 2026-10-09)
export const GET: RequestHandler = ({ url }) =>
	new Response(
		env.INDEXING === '1'
			? `User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`
			: 'User-agent: *\nDisallow: /\n',
		{
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'cache-control': 'public, max-age=300'
			}
		}
	);
