import { error } from '@sveltejs/kit';
import { lessonOf } from '$lib/lessons';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const lesson = lessonOf(params.slug);
	if (!lesson) error(404, 'Nie ma takiej kolorowanki');
	return { lesson };
};
