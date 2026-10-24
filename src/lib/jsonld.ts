import type { Card } from './cards.ts';
import { SITE } from './site.ts';

/*
 * What search engines read about a page besides its text (schema.org as JSON-LD, put in by components/Head.svelte):
 * the site and the channel on the home page, a video on the page of a song, the songs in order on a playlist.
 * Addresses are whole, with the site's origin. No imports beyond site.ts and types: tests/unit runs this file in
 * plain Node.
 */

export type JsonLd = Record<string, unknown>;

/** 149 → "PT2M29S" */
export function isoDuration(total: number): string {
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || !(h || m) ? `${s}S` : ''}`;
}

const channelOf = (origin: string): JsonLd => ({
	'@type': 'Organization',
	'@id': `${origin}/#kanal`,
	name: SITE.name,
	url: `${origin}/`,
	logo: `${origin}/icon-512.png`,
	sameAs: [SITE.channel]
});

/** The home page: the site and the channel behind it */
export const siteLd = (origin: string): JsonLd => ({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${origin}/#strona`,
			name: SITE.name,
			url: `${origin}/`,
			description: SITE.description,
			inLanguage: 'pl',
			publisher: { '@id': `${origin}/#kanal` }
		},
		channelOf(origin)
	]
});

/** The page of a song or a short: the video on it, played from YouTube */
export const videoLd = (
	origin: string,
	video: Card & { fullTitle: string; published: string },
	description: string,
	path: string
): JsonLd => ({
	'@context': 'https://schema.org',
	'@type': 'VideoObject',
	name: video.subtitle ? `${video.title} – ${video.subtitle}` : video.title,
	description: description || video.fullTitle,
	thumbnailUrl: [
		`${origin}/miniatura/${video.id}-${video.short ? 's' : 'l'}.jpg`,
		`${origin}/miniatura/${video.id}-m.jpg`
	],
	uploadDate: video.published,
	...(video.seconds ? { duration: isoDuration(video.seconds) } : {}),
	embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
	url: `${origin}${path}`,
	inLanguage: 'pl',
	isFamilyFriendly: true,
	author: channelOf(origin)
});

/** A playlist: its songs in order, each by the address of its page here */
export const playlistLd = (
	origin: string,
	title: string,
	videos: { title: string; path: string }[]
): JsonLd => ({
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	name: title,
	numberOfItems: videos.length,
	itemListElement: videos.map((v, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: v.title,
		url: `${origin}${v.path}`
	}))
});

/** JSON for inside <script>: "</script>" in a title cannot end the element */
export const ldScript = (data: JsonLd) =>
	`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
