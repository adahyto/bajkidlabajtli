import { error } from '@sveltejs/kit';
import { songPage } from '$lib/server/song';
import { getChannel } from '$lib/server/youtube';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const channel = await getChannel();
	const video = channel.videos.find((v) => !v.short && v.slug === params.slug);
	if (!video) error(404, 'Nie ma takiej piosenki');
	return songPage(channel, video);
};
