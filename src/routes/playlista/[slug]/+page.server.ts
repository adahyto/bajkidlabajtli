import { error } from '@sveltejs/kit';
import { toCard } from '$lib/cards';
import { getChannel } from '$lib/server/youtube';
import type { Video } from '$lib/types';
import type { PageServerLoad } from './$types';

/** The description without its first line when that is the title again, paragraphs one empty line apart */
const about = (title: string, description: string) =>
	description
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter((p, i) => p && !(i === 0 && p.toLowerCase().startsWith(title.toLowerCase())))
		.join('\n\n');

export const load: PageServerLoad = async ({ params }) => {
	const channel = await getChannel();
	const playlist = channel.playlists.find((p) => p.slug === params.slug);
	if (!playlist) error(404, 'Nie ma takiej playlisty');
	const videos = playlist.videoIds
		.map((id) => channel.videos.find((v) => v.id === id))
		.filter((v): v is Video => !!v);
	return {
		playlist: { title: playlist.title, description: about(playlist.title, playlist.description) },
		videos: videos.map(toCard)
	};
};
