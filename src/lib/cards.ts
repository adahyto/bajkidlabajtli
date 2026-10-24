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
	/** A short on the home page: the title of its full song */
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

export const pathOf = (v: { short: boolean; slug: string }) =>
	`/${v.short ? 'krotka' : 'piosenka'}/${v.slug}` as const;

/** The picture of a video from this server (routes/miniatura) */
export const thumbOf = (id: string, size: 'm' | 'l' | 's') => `/miniatura/${id}-${size}.jpg`;
