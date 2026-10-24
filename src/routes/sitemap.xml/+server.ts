import { getChannel } from '$lib/server/youtube';
import type { RequestHandler } from './$types';

/** The home page, every song, short and playlist of the channel, /dla-rodzicow and /prywatnosc */
export const GET: RequestHandler = async ({ url }) => {
	const channel = await getChannel();
	const day = (iso: string) => iso.slice(0, 10);
	const newest = channel.videos[0]?.published ?? '';
	const pages: { path: string; lastmod?: string }[] = [
		{ path: '/', lastmod: newest && day(newest) },
		...channel.videos.map((v) => ({
			path: `/${v.short ? 'krotka' : 'piosenka'}/${v.slug}`,
			lastmod: day(v.published)
		})),
		...channel.playlists.map((p) => ({ path: `/playlista/${p.slug}` })),
		{ path: '/dla-rodzicow', lastmod: newest && day(newest) },
		{ path: '/prywatnosc' }
	];
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		({ path, lastmod }) =>
			`\t<url><loc>${new URL(path, url.origin).href}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
	)
	.join('\n')}
</urlset>
`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
};
