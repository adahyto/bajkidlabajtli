import { GUIDES } from '$lib/guides';
import { getChannel } from '$lib/server/youtube';
import { firstSentence } from '$lib/seo';
import type { Video } from '$lib/types';
import type { RequestHandler } from './$types';

const xml = (text: string) =>
	text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

/*
 * The home page, every song and playlist of the channel, /dla-rodzicow, the guides and /prywatnosc. A short is here
 * only when its full song is not on the channel: otherwise its page points search engines to the song's
 * (lib/server/song.ts).
 * Each video page also tells about its video (Google's video sitemap): the picture, title, what it is about, the
 * player, length and date.
 */
export const GET: RequestHandler = async ({ url }) => {
	const channel = await getChannel();
	const day = (iso: string) => iso.slice(0, 10);
	const newest = channel.videos[0]?.published ?? '';
	const at = (path: string) => new URL(path, url.origin).href;
	const videoTag = (v: Video) =>
		[
			'<video:video>',
			`<video:thumbnail_loc>${at(`/miniatura/${v.id}-${v.short ? 's' : 'l'}.jpg`)}</video:thumbnail_loc>`,
			`<video:title>${xml(v.subtitle ? `${v.title} – ${v.subtitle}` : v.title)}</video:title>`,
			`<video:description>${xml(firstSentence(v.parents.intro) || v.subtitle || v.title)}</video:description>`,
			`<video:player_loc>https://www.youtube-nocookie.com/embed/${v.id}</video:player_loc>`,
			v.seconds ? `<video:duration>${v.seconds}</video:duration>` : '',
			`<video:publication_date>${v.published}</video:publication_date>`,
			'</video:video>'
		].join('');
	const pages: { path: string; lastmod?: string; video?: Video }[] = [
		{ path: '/', lastmod: newest && day(newest) },
		...channel.videos
			.filter((v) => !v.fullId)
			.map((v) => ({
				path: `/${v.short ? 'krotka' : 'piosenka'}/${v.slug}`,
				lastmod: day(v.published),
				video: v
			})),
		...channel.playlists.map((p) => ({ path: `/playlista/${p.slug}` })),
		{ path: '/dla-rodzicow', lastmod: newest && day(newest) },
		{
			path: '/poradnik',
			lastmod: GUIDES.map((g) => g.updated)
				.sort()
				.at(-1)
		},
		...GUIDES.map((g) => ({ path: `/poradnik/${g.slug}`, lastmod: g.updated })),
		{ path: '/prywatnosc' }
	];
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages
	.map(
		({ path, lastmod, video }) =>
			`\t<url><loc>${at(path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${video ? videoTag(video) : ''}</url>`
	)
	.join('\n')}
</urlset>
`,
		// A new song shows in it within minutes, also through Cloudflare (as robots.txt)
		{
			headers: {
				'content-type': 'application/xml; charset=utf-8',
				'cache-control': 'public, max-age=300'
			}
		}
	);
};
