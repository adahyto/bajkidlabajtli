import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// Until launch (INDEXING=1 in docker-compose.yaml) search engines and AI crawlers are asked to stay away; after
// it every page is open, with the sitemap
export const GET: RequestHandler = ({ url }) =>
	new Response(
		env.INDEXING === '1'
			? `User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`
			: 'User-agent: *\nDisallow: /\n',
		{ headers: { 'content-type': 'text/plain; charset=utf-8' } }
	);
