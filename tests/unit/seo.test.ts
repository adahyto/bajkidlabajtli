import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	cut,
	firstSentence,
	playlistDescription,
	songDescription,
	songTitle,
	withSite
} from '../../src/lib/seo.ts';
import { newPages } from '../../src/lib/server/indexnow.ts';
import { parseDescription, splitTitle } from '../../src/lib/server/description.ts';

// The channel's videos as read from the YouTube API on 2026-10-24, with the songs of 2026-10-28 and 29
const channel = JSON.parse(
	readFileSync(new URL('../fixtures/channel.json', import.meta.url), 'utf8')
);

test("song titles say what the song is about; the site's name only when it fits in 70", () => {
	assert.equal(
		songTitle({
			title: 'Gdy się zgubię',
			subtitle: 'Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie',
			short: false
		}),
		'Gdy się zgubię – piosenka dla dzieci: co robić, gdy zgubisz się w sklepie'
	);
	assert.equal(
		songTitle({
			title: 'Złote monetki',
			subtitle: 'Piosenka dla dzieci o zakupach w grach',
			short: false
		}),
		'Złote monetki – piosenka dla dzieci o zakupach w grach'
	);
	// A subtitle that starts with a name keeps its capital
	assert.equal(
		songTitle({
			title: 'Dzyń, dzyń, dzyń!',
			subtitle: 'Złote monetki – piosenka dla dzieci',
			short: true
		}),
		'Dzyń, dzyń, dzyń! – Złote monetki – piosenka dla dzieci'
	);
	assert.equal(
		songTitle({ title: 'Nowa', subtitle: '', short: true }),
		'Nowa – krótka piosenka dla dzieci | Bajki dla Bajtli'
	);
	assert.equal(withSite('x'.repeat(60)), 'x'.repeat(60));
});

test('descriptions end at a sentence and fit', () => {
	assert.equal(firstSentence('Raz! Dwa. Trzy'), 'Raz!');
	assert.equal(firstSentence('Bez kropki'), 'Bez kropki');
	assert.equal(cut('Krótkie.'), 'Krótkie.');
	assert.equal(cut(`${'a'.repeat(100)}. ${'b'.repeat(100)}.`), `${'a'.repeat(100)}.`);
	const long = cut(`${'słowo '.repeat(60)}koniec.`);
	assert.ok(long.length <= 158 && long.endsWith('słowo…'), long);
	// A playlist names its songs while they fit, the rest "i inne"
	assert.equal(
		playlistDescription('2 piosenki', ['Raz ja, raz ty', 'Klik z głową']),
		'2 piosenki z Pikselkiem, jedna po drugiej: „Raz ja, raz ty”, „Klik z głową”.'
	);
	const titles = channel.playlists[0].videoIds.map(
		(id: string) =>
			splitTitle(channel.videos.find((v: { id: string }) => v.id === id).fullTitle).title
	);
	const all = playlistDescription('7 piosenek', titles);
	assert.ok(all.length <= 158 && all.endsWith(' i inne.'), all);
	assert.ok(
		all.startsWith('7 piosenek z Pikselkiem, jedna po drugiej: „Czytaj ze mną”, „Raz ja, raz ty”'),
		all
	);
	for (const v of channel.videos) {
		const { title, subtitle } = splitTitle(v.fullTitle);
		const parents = parseDescription(v.description, v.fullTitle);
		const text = songDescription({
			subtitle,
			intro: parents.intro,
			short: /#shorts/i.test(v.fullTitle),
			forParents: parents.rules.length > 0
		});
		assert.ok(text.length >= 50 && text.length <= 158, `${title}: ${text.length} ${text}`);
		assert.ok(/[.!?…]$/.test(text), `${title}: ${text}`);
	}
});

test('IndexNow: only new videos, after a first read, not old ones newly seen', () => {
	const at = Date.parse('2026-10-25T12:00:00Z');
	const song = (id: string, slug: string, published: string, more = {}) => ({
		id,
		slug,
		published,
		short: false,
		...more
	});
	const before = {
		videos: [song('a', 'stara', '2026-10-01T00:00:00Z')],
		playlists: [],
		updated: '',
		source: 'api'
	};
	const after = {
		...before,
		videos: [
			song('b', 'nowa', '2026-10-25T08:00:00Z'),
			song('c', 'refren', '2026-10-25T09:00:00Z', { short: true, fullId: 'b' }),
			song('d', 'dawna', '2026-09-01T00:00:00Z'),
			...before.videos
		]
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const pages = (b: any, a: any) => newPages(b, a, at);
	assert.deepEqual(pages(before, after), ['/piosenka/nowa', '/', '/dla-rodzicow']);
	assert.deepEqual(pages(null, after), []);
	assert.deepEqual(pages(before, before), []);
});
