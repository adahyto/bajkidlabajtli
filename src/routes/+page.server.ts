import { toCard } from '$lib/cards';
import { getChannel } from '$lib/server/youtube';
import type { PageServerLoad } from './$types';

/** The first paragraph of a playlist's description that is not its title again, for its card */
function summary(title: string, description: string): string {
	const paragraph = description
		.split(/\n\s*\n/)
		.map((p) => p.replace(/\s+/g, ' ').trim())
		.find((p) => p && !p.toLowerCase().startsWith(title.toLowerCase()));
	if (!paragraph || paragraph.length <= 240) return paragraph ?? '';
	return `${paragraph.slice(0, 240).replace(/\s+\S*$/, '')}…`;
}

// A song is "Nowa" on the home page for two weeks, then only "Najnowsza"
const NEW_MS = 14 * 24 * 60 * 60 * 1000;

export const load: PageServerLoad = async () => {
	const channel = await getChannel();
	const songs = channel.videos.filter((v) => !v.short);
	const shorts = channel.videos.filter((v) => v.short);
	const hero = songs[0] ?? channel.videos[0];
	// Only when it says more than the short's own title ("Jeden, jeden, dwa!" is the song "Jeden, jeden, dwa")
	const letters = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
	const fromOf = (short: (typeof shorts)[number]) => {
		const title = songs.find((v) => v.id === short.fullId)?.title;
		return title && letters(title) !== letters(short.title) ? title : undefined;
	};
	return {
		hero: hero ? toCard(hero) : null,
		heroNew: !!hero && Date.now() - Date.parse(hero.published) < NEW_MS,
		songs: songs.map(toCard),
		// A short's title is a line of the chorus; its card also names the song it comes from
		shorts: shorts.map((v) => ({ ...toCard(v), from: fromOf(v) })),
		playlists: channel.playlists.map((p) => ({
			title: p.title,
			slug: p.slug,
			summary: summary(p.title, p.description),
			count: p.videoIds.length,
			pictures: p.videoIds.slice(0, 4)
		}))
	};
};
