import { toCard } from '$lib/cards';
import { getChannel } from '$lib/server/youtube';
import type { PageServerLoad } from './$types';

/** The songs and the shorts, newest first, as on the home page */
export const load: PageServerLoad = async () => {
	const channel = await getChannel();
	return {
		songs: channel.videos.filter((v) => !v.short).map(toCard),
		shorts: channel.videos.filter((v) => v.short).map(toCard)
	};
};
