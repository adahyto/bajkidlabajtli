import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	fullIdOf,
	isShort,
	parseDescription,
	seconds,
	slugify,
	splitTitle
} from '../../src/lib/server/description.ts';

// The channel's videos as read from the YouTube API on 2026-10-24
const channel = JSON.parse(
	readFileSync(new URL('../fixtures/channel.json', import.meta.url), 'utf8')
);
const video = (id: string) => channel.videos.find((v: { id: string }) => v.id === id);
const parse = (id: string) => parseDescription(video(id).description, video(id).fullTitle);

test('titles lose the hero, emoji and hashtags', () => {
	assert.deepEqual(
		splitTitle(
			'Pikselek - Klik z głową 🖱️ Piosenka dla dzieci o bezpiecznym internecie #pikselek #piosenkidladzieci'
		),
		{ title: 'Klik z głową', subtitle: 'Piosenka dla dzieci o bezpiecznym internecie' }
	);
	assert.deepEqual(splitTitle('Dzyń, dzyń, dzyń! 🪙 Złote monetki – piosenka dla dzieci #shorts'), {
		title: 'Dzyń, dzyń, dzyń!',
		subtitle: 'Złote monetki – piosenka dla dzieci'
	});
	assert.deepEqual(splitTitle('Bez emoji'), { title: 'Bez emoji', subtitle: '' });
});

test('addresses, lengths, shorts', () => {
	assert.equal(slugify('Gdy się zgubię'), 'gdy-sie-zgubie');
	assert.equal(slugify('Złote monetki'), 'zlote-monetki');
	assert.equal(slugify('Niespodzianka tak, sekret nie!'), 'niespodzianka-tak-sekret-nie');
	assert.equal(seconds('PT2M29S'), 149);
	assert.equal(seconds('PT18S'), 18);
	assert.equal(seconds('PT1H2M3S'), 3723);
	assert.equal(seconds('nonsense'), 0);
	assert.ok(isShort('Stój jak drzewo! #shorts', ''));
	assert.ok(!isShort('Gdy się zgubię', 'Piosenka'));
	assert.equal(fullIdOf(video('9-2NMQcT1N4').description), 'nvQ1vsDZJds');
	assert.equal(fullIdOf(video('Uo1OsJlukhM').description), undefined);
});

test('a song: intro, rules, tips', () => {
	const p = parse('nvQ1vsDZJds');
	assert.match(p.intro, /^Wesoła piosenka dla dzieci o tym, co zrobić, gdy zgubimy się/);
	assert.equal(p.rules.length, 5);
	assert.deepEqual(p.rules[0], {
		icon: '🌳',
		text: 'Stój jak drzewo – zostań w miejscu, nie szukaj sam.'
	});
	assert.equal(p.tips.length, 1);
	assert.match(p.tips[0].text, /^Przećwiczcie te zasady/);
	assert.ok(p.singAlong);
	assert.equal(p.help.length, 0);
});

test('a song with points and phone numbers; a ❤️ rule stays', () => {
	const p = parse('x9ulnPUktvw');
	assert.equal(p.rules.length, 5);
	assert.match(p.rules[3].text, /^Za powiedzenie nie ma kary/);
	assert.equal(p.tips.filter((t) => t.point).length, 4);
	assert.match(p.helpIntro, /^Jeśli niepokoi Cię coś/);
	assert.ok(!p.tips.some((t) => t.text === p.helpIntro));
	assert.deepEqual(
		p.help.map((h) => h.text.slice(0, 11)),
		['116 111 – T', '800 100 100', 'W sytuacji ']
	);
	// "Zobacz też inne piosenki" and "SUBSKRYBUJ" are not for parents
	assert.ok(!JSON.stringify(p).includes('Zobacz'));
	assert.ok(!JSON.stringify(p).includes('SUBSKRYBUJ'));
});

test('a short: its first line, nothing else', () => {
	const p = parse('9-2NMQcT1N4');
	assert.equal(p.intro, 'Refren piosenki „Gdy się zgubię” – co robić, gdy zgubisz się w sklepie.');
	assert.equal(p.rules.length, 0);
	assert.equal(p.tips.length, 0);
	assert.equal(parse('Uo1OsJlukhM').intro.slice(0, 33), 'Refren piosenki „Jeden, jeden, dw');
});
