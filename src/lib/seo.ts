import { SITE } from './site.ts';

/*
 * Titles and descriptions for search results. Parents search with a question ("co zrobić, gdy dziecko zgubi się
 * w sklepie"), not with a song's name nobody knows yet, so a song's title says what it is about, from YouTube's
 * title ("Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie"). Google shows ~60 characters of a title and
 * ~155 of a description: the site's name goes only when it fits, a description ends at a sentence. No imports
 * beyond site.ts: tests/unit runs this file in plain Node.
 */

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 158;

/** With the site's name when it fits */
export const withSite = (title: string) =>
	`${title} | ${SITE.name}`.length <= TITLE_MAX ? `${title} | ${SITE.name}` : title;

/** "Gdy się zgubię – piosenka dla dzieci: co robić, gdy zgubisz się w sklepie" */
export function songTitle(v: { title: string; subtitle: string; short: boolean }): string {
	const about = v.subtitle
		? v.subtitle.replace(/^Piosenka\b/, 'piosenka')
		: v.short
			? 'krótka piosenka dla dzieci'
			: 'piosenka dla dzieci';
	return withSite(`${v.title} – ${about}`);
}

/** The first sentence: to the first . ! or ? followed by a space or the end */
export function firstSentence(text: string): string {
	const m = /^.*?[.!?…](?=\s|$)/s.exec(text.trim());
	return (m ? m[0] : text).replace(/\s+/g, ' ').trim();
}

/** Whole sentences that fit; a first sentence too long for it ends at a word, with "…" */
export function cut(text: string, max = DESCRIPTION_MAX): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const sentences = clean.match(/[^.!?…]+[.!?…]+(?=\s|$)|[^.!?…]+$/g) ?? [clean];
	let out = '';
	for (const s of sentences) {
		const next = `${out} ${s.trim()}`.trim();
		if (next.length > max) break;
		out = next;
	}
	if (out) return out;
	return `${clean.slice(0, max - 1).replace(/[\s,;:–-]+\S*$/, '')}…`;
}

/** "7 piosenek z Pikselkiem, jedna po drugiej: „Czytaj ze mną”, „Raz ja, raz ty” … i inne." as many titles as fit */
export function playlistDescription(count: string, titles: string[]): string {
	const head = `${count} z Pikselkiem, jedna po drugiej: `;
	for (let n = titles.length; n > 0; n--) {
		const list = titles
			.slice(0, n)
			.map((t) => `„${t}”`)
			.join(', ');
		const text = `${head}${list}${n < titles.length ? ' i inne' : ''}.`;
		if (text.length <= DESCRIPTION_MAX) return text;
	}
	return cut(`${head}${titles.join(', ')}.`);
}

/**
 * A song's description: what it is about (the first sentence of its description on YouTube; a short also says what
 * its subtitle says) and, when the site has them, that the rules and questions for parents are here
 */
export function songDescription(v: {
	subtitle: string;
	intro: string;
	short: boolean;
	forParents: boolean;
}): string {
	const lead = firstSentence(v.intro);
	const parts = lead ? (v.short && v.subtitle ? [`${v.subtitle}.`, lead] : [lead]) : [v.subtitle];
	if (v.forParents) parts.push('Z zasadami i pytaniami do rozmowy dla rodziców.');
	return cut(parts.filter(Boolean).join(' ').replace(/\.\./g, '.'));
}
