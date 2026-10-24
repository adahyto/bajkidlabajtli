import { toCard } from '$lib/cards';
import { getChannel } from '$lib/server/youtube';
import { SONGS } from '$lib/songs';
import type { PageServerLoad } from './$types';

/** Every song with what it tells parents (as on its own page, lib/server/song.ts), and the numbers for help once */
export const load: PageServerLoad = async () => {
	const channel = await getChannel();
	const songs = channel.videos
		.filter((v) => !v.short)
		.map((v) => ({
			card: toCard(v),
			intro: v.parents.intro,
			rules: v.parents.rules,
			tips: v.parents.tips,
			questions: SONGS[v.id]?.questions ?? []
		}))
		.filter((s) => s.rules.length || s.questions.length);
	// The same numbers stand under several songs
	const help = channel.videos
		.filter((v) => !v.short)
		.flatMap((v) => v.parents.help)
		.filter((line, i, all) => all.findIndex((l) => l.text === line.text) === i);
	const helpIntro = channel.videos.find((v) => v.parents.helpIntro)?.parents.helpIntro ?? '';
	return { songs, help, helpIntro };
};
