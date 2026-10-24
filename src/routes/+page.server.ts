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

export const load: PageServerLoad = async () => {
	const channel = await getChannel();
	const songs = channel.videos.filter((v) => !v.short);
	const shorts = channel.videos.filter((v) => v.short);
	const hero = songs[0] ?? channel.videos[0];
	return {
		hero: hero ? toCard(hero) : null,
		songs: songs.map(toCard),
		shorts: shorts.map(toCard),
		playlists: channel.playlists.map((p) => ({
			title: p.title,
			slug: p.slug,
			summary: summary(p.title, p.description),
			count: p.videoIds.length,
			pictures: p.videoIds.slice(0, 4)
		})),
		// For the table for parents: what each song is about and its first rule
		rules: songs
			.filter((v) => v.parents.rules.length)
			.map((v) => ({ card: toCard(v), about: v.subtitle, rule: v.parents.rules[0] }))
	};
};
