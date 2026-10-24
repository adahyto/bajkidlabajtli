import { SONGS } from './songs';
import type { Video } from './types';

/** What a card of a video needs: pages send these, not the whole descriptions */
export type Card = {
	id: string;
	title: string;
	subtitle: string;
	slug: string;
	seconds: number;
	short: boolean;
	topic: string;
	/** A short: the title of its full song, on every card of a short alike */
	from?: string;
};

export const toCard = (v: Video): Card => ({
	id: v.id,
	title: v.title,
	subtitle: v.subtitle,
	slug: v.slug,
	seconds: v.seconds,
	short: v.short,
	topic: SONGS[v.id]?.topic ?? ''
});

/** Cards for a list of videos: each short also names the song it comes from, out of the channel's videos */
export const cardsIn =
	(videos: Video[]) =>
	(v: Video): Card => ({
		...toCard(v),
		from: v.short ? videos.find((f) => !f.short && f.id === v.fullId)?.title : undefined
	});

export const pathOf = (v: { short: boolean; slug: string }) =>
	`/${v.short ? 'krotka' : 'piosenka'}/${v.slug}` as const;

/** The picture of a video from this server (routes/miniatura) */
export const thumbOf = (id: string, size: 'm' | 'h' | 'l' | 's') => `/miniatura/${id}-${size}.jpg`;

/** A big picture: 960 px for a phone, 1280 px for the rest (srcset) */
export const bigOf = (id: string) => `${thumbOf(id, 'h')} 960w, ${thumbOf(id, 'l')} 1280w`;
