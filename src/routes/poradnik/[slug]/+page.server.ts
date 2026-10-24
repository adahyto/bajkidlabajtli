import { error } from '@sveltejs/kit';
import { toCard } from '$lib/cards';
import { guideOf } from '$lib/guides';
import { getChannel } from '$lib/server/youtube';
import { SONGS } from '$lib/songs';
import type { PageServerLoad } from './$types';

/** A guide with its song (when the channel has it) and the song's questions for a talk */
export const load: PageServerLoad = async ({ params }) => {
	const guide = guideOf(params.slug);
	if (!guide) error(404, 'Nie ma takiego poradnika');
	const channel = await getChannel();
	const song = channel.videos.find((v) => v.id === guide.songId);
	return {
		guide,
		song: song ? toCard(song) : null,
		questions: SONGS[guide.songId]?.questions ?? []
	};
};
