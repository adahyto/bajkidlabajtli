import type { Parents } from '../types.ts';

/*
 * What the titles and descriptions of the channel's videos say, read the way the channel writes them (2026-10):
 *
 *   Pikselek - Gdy się zgubię 🌳 Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie #pikselek
 *
 *   <the title again>
 *   <a paragraph about the song, ending with "…zna kilka prostych zasad:">
 *   🌳 Stój jak drzewo – zostań w miejscu, nie szukaj sam.      (the rules, one per line, each with an emoji)
 *   Śpiewaj razem z nami – tekst pojawia się na ekranie.
 *   Dla rodziców: <paragraphs and "• " points>
 *   Jeśli niepokoi Cię…:  📞 116 111 – …  🚨 W sytuacji zagrożenia: 112
 *   Zobacz też inne piosenki z Pikselkiem:  ▶️ …
 *   ♥️♥️♥️  SUBSKRYBUJ  ♥️♥️♥️
 *
 * and a short: "Refren piosenki „Gdy się zgubię” – …" with "Cały teledysk: https://www.youtube.com/watch?v=<id>".
 * A line with this site's address (🌐 https://bajkidlabajtli.pl, anywhere) is left out.
 * A part the description does not have stays empty, so a video described otherwise still shows, only without the
 * card for parents. No imports beyond types: tests/unit runs this file in plain Node.
 */

/** The hero's name before the song's in the channel's titles: "Pikselek - Klik z głową" */
const HERO_PREFIX = /^Pikselek\s*[-–—]\s*/i;
const HASHTAG = /#[\p{L}\p{N}_]+/gu;
const EMOJI = /\p{Extended_Pictographic}/u;
const EMOJI_ALL = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;
/** An emoji (with its variation selector) at the start of a line, and what follows */
const LEADING_EMOJI =
	/^(\p{Extended_Pictographic}[\u{FE0F}\u{200D}\p{Extended_Pictographic}]*)\s*(.*)$/u;

const HELP_ICONS = new Set(['📞', '🚨', '☎']);
// Links to other songs, and the hearts around "SUBSKRYBUJ" (a ❤️ in front of a rule is a rule)
const SKIPPED_ICONS = new Set(['▶', '♥']);

const base = (icon: string) => icon.replace(/[\u{FE0F}\u{200D}]/gu, '').slice(0, 2);
const upperFirst = (text: string) => text.charAt(0).toLocaleUpperCase('pl') + text.slice(1);
const squeeze = (text: string) => text.replace(/\s+/g, ' ').trim();

/** "Pikselek - Gdy się zgubię 🌳 Piosenka dla dzieci: … #pikselek" → title and subtitle */
export function splitTitle(fullTitle: string): { title: string; subtitle: string } {
	const text = squeeze(fullTitle.replace(HASHTAG, '')).replace(HERO_PREFIX, '');
	const emoji = EMOJI.exec(text);
	if (!emoji) return { title: text, subtitle: '' };
	const title = text.slice(0, emoji.index).trim();
	const subtitle = squeeze(text.slice(emoji.index).replace(EMOJI_ALL, ''));
	// A title that starts with an emoji: the whole of it is the title
	if (!title) return { title: subtitle, subtitle: '' };
	return { title, subtitle: upperFirst(subtitle) };
}

/** Shorts are marked by the channel with #shorts, in the title or the description */
export const isShort = (fullTitle: string, description: string, tags: string[] = []) =>
	/#shorts?\b/i.test(fullTitle) ||
	/#shorts?\b/i.test(description) ||
	tags.some((t) => /^shorts?$/i.test(t));

/** The full song a short comes from: "Cały teledysk: https://www.youtube.com/watch?v=<id>" (also "teledysk :") */
export function fullIdOf(description: string): string | undefined {
	return /Cały teledysk\s*:\s*https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/i.exec(
		description
	)?.[1];
}

/**
 * A short whose description does not link its full song (the short came out first): the song the short names —
 * by its own title ("Jeden, jeden, dwa!"), in its subtitle ("Złote monetki – piosenka dla dzieci") or in its
 * description ("Refren piosenki „Gdy się zgubię”"). Only when exactly one song has that title.
 */
export function fullIdByTitle(
	short: { title: string; subtitle: string; description: string },
	songs: { id: string; title: string }[]
): string | undefined {
	const names = [
		short.title,
		short.subtitle.split(/\s[–—-]\s/)[0],
		/piosenki\s+„([^”"]+)[”"]/i.exec(short.description)?.[1] ?? ''
	];
	const keys = new Set(names.map(slugify).filter(Boolean));
	const found = songs.filter((s) => keys.has(slugify(s.title)));
	return found.length === 1 ? found[0].id : undefined;
}

/** A part of an address from a title: "Niespodzianka tak, sekret nie" → "niespodzianka-tak-sekret-nie" */
export function slugify(text: string): string {
	return text
		.toLocaleLowerCase('pl')
		.replace(/ł/g, 'l')
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80)
		.replace(/-+$/, '');
}

/** "PT2M29S" → 149 */
export function seconds(duration: string): number {
	const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(duration);
	if (!m) return 0;
	const [d, h, min, s] = m.slice(1).map((v) => Number(v ?? 0));
	return ((d * 24 + h) * 60 + min) * 60 + s;
}

/** The parts of a description for parents (see the top of this file) */
export function parseDescription(description: string, fullTitle = ''): Parents {
	const parents: Parents = {
		intro: '',
		rules: [],
		tips: [],
		helpIntro: '',
		help: [],
		singAlong: false
	};
	const titleKey = JSON.stringify(splitTitle(fullTitle));
	const blocks = description
		.replace(/\r/g, '')
		.split(/\n\s*\n/)
		.map((block) =>
			block
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean)
		)
		.filter((lines) => lines.length);

	let inTips = false;
	let lastParagraph = '';
	let firstParagraph = '';

	for (const lines of blocks) {
		const plain: string[] = [];
		for (const [index, line] of lines.entries()) {
			if (!line.replace(HASHTAG, '').trim()) continue;
			if (/^Cały teledysk/i.test(line)) continue;
			// A link to this site, wherever the channel puts it, is not about the song
			if (/bajkidlabajtli\.pl/i.test(line)) continue;
			if (/^Śpiewaj razem/i.test(line)) {
				parents.singAlong = /tekst/i.test(line);
				continue;
			}
			// "Zobacz też inne piosenki": links to the other songs, which the site shows its own way
			if (/^Zobacz (też|także)/i.test(line)) {
				inTips = false;
				break;
			}
			const lead = LEADING_EMOJI.exec(line);
			const icon = lead ? base(lead[1]) : '';
			if (icon && [...SKIPPED_ICONS].some((s) => icon.startsWith(s))) continue;
			if (icon && HELP_ICONS.has(icon)) {
				// The sentence before the numbers ("Jeśli niepokoi Cię coś…:") goes with them
				const before = index > 0 ? lines[index - 1] : '';
				if (!parents.helpIntro && before.endsWith(':') && !LEADING_EMOJI.test(before)) {
					parents.helpIntro = before;
					const at = parents.tips.findIndex((t) => t.text === before);
					if (at >= 0) parents.tips.splice(at, 1);
				}
				parents.help.push({ icon: lead![1], text: squeeze(lead![2]) });
				continue;
			}
			const tips = /^Dla rodziców\s*:?\s*(.*)$/i.exec(line);
			if (tips) {
				inTips = true;
				if (tips[1]) parents.tips.push({ text: upperFirst(squeeze(tips[1])), point: false });
				continue;
			}
			if (inTips) {
				const point = /^[•·\-–*]\s+(.*)$/.exec(line);
				parents.tips.push(
					point ? { text: squeeze(point[1]), point: true } : { text: squeeze(line), point: false }
				);
				continue;
			}
			if (lead) {
				if (!parents.rules.length) {
					parents.intro = plain.length ? squeeze(plain.join(' ')) : lastParagraph;
					plain.length = 0;
				}
				parents.rules.push({ icon: lead[1], text: squeeze(lead[2]) });
				continue;
			}
			plain.push(line);
		}
		if (plain.length) {
			const paragraph = squeeze(plain.join(' '));
			// The title written again at the top of the description is not about the song
			if (JSON.stringify(splitTitle(paragraph)) === titleKey) continue;
			if (/SUBSKRYBUJ/i.test(paragraph)) continue;
			lastParagraph = paragraph;
			if (!firstParagraph && !parents.rules.length) firstParagraph = paragraph;
		}
	}
	if (!parents.rules.length) parents.intro = firstParagraph;
	return parents;
}
