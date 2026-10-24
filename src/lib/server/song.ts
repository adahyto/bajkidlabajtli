import { pathOf, toCard } from '$lib/cards';
import { SONGS } from '$lib/songs';
import type { Channel, Video } from '$lib/types';

/** The one before and after in a list: none before the first, after the last the first again (`again`) */
export function around<T>(
	list: T[],
	at: number
): { prev: T | null; next: T | null; again: boolean } {
	if (list.length < 2 || at < 0) return { prev: null, next: null, again: false };
	return {
		prev: at > 0 ? list[at - 1] : null,
		next: list[(at + 1) % list.length],
		again: at === list.length - 1
	};
}

/** What the page of a song or a short shows */
export function songPage(channel: Channel, video: Video) {
	// A short tells parents what its full song does
	const full = video.fullId ? channel.videos.find((v) => v.id === video.fullId) : undefined;
	const about = full ?? video;
	// The order of the first playlist with it, otherwise of the site (the newest first), the same kind only
	const playlist = channel.playlists.find((p) => p.videoIds.includes(video.id));
	const order = playlist
		? playlist.videoIds
				.map((id) => channel.videos.find((v) => v.id === id))
				.filter((v): v is Video => !!v && v.short === video.short)
		: channel.videos.filter((v) => v.short === video.short);
	const at = order.findIndex((v) => v.id === video.id);
	const { prev, next, again } = around(order, at);
	return {
		video: {
			...toCard(video),
			fullTitle: video.fullTitle,
			published: video.published,
			intro: video.parents.intro
		},
		parents: about.parents,
		extra: SONGS[about.id] ?? {},
		full: full ? toCard(full) : null,
		// A short with its full song on the channel says the same to parents: search engines take the song's page
		canonical: full ? pathOf(full) : null,
		short: (() => {
			const short = video.short ? undefined : channel.videos.find((v) => v.fullId === video.id);
			return short ? toCard(short) : null;
		})(),
		playlist: playlist
			? { title: playlist.title, slug: playlist.slug, position: at + 1, count: order.length }
			: null,
		prev: prev ? toCard(prev) : null,
		next: next ? toCard(next) : null,
		// After the last one the list starts again: "Od początku", not "Następna"
		again,
		more: channel.videos
			.filter((v) => v.short === video.short && v.id !== video.id)
			.slice(0, 4)
			.map(toCard)
	};
}
