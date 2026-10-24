import { error } from '@sveltejs/kit';
import { toCard } from '$lib/cards';
import { lessonOf } from '$lib/lessons';
import { getChannel } from '$lib/server/youtube';
import { SONGS } from '$lib/songs';
import type { PageServerLoad } from './$types';

/** A lesson plan with its song (when the channel has it), the song's rules and questions */
export const load: PageServerLoad = async ({ params }) => {
	const lesson = lessonOf(params.slug);
	if (!lesson) error(404, 'Nie ma takiego scenariusza');
	const channel = await getChannel();
	const song = channel.videos.find((v) => v.id === lesson.songId);
	// A short's rules are its full song's
	const full = song?.fullId ? channel.videos.find((v) => v.id === song.fullId) : undefined;
	return {
		lesson,
		song: song ? toCard(song) : null,
		rules: (full ?? song)?.parents.rules ?? [],
		questions: SONGS[lesson.songId]?.questions ?? []
	};
};
