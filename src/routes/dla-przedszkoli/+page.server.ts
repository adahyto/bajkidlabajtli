import { getChannel } from '$lib/server/youtube';
import type { PageServerLoad } from './$types';

/** Which lessons' songs are on the channel, for their pictures */
export const load: PageServerLoad = async () => {
	const channel = await getChannel();
	return {
		songs: Object.fromEntries(channel.videos.map((v) => [v.id, { short: v.short }]))
	};
};
