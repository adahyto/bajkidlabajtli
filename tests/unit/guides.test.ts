import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GUIDES, guidesForSong } from '../../src/lib/guides.ts';

// The channel's videos as read from the YouTube API on 2026-10-24, with the songs of 2026-10-28 and 29
const channel = JSON.parse(
	readFileSync(new URL('../fixtures/channel.json', import.meta.url), 'utf8')
);

test('every guide is complete and fits in search results', () => {
	const slugs = new Set<string>();
	for (const g of GUIDES) {
		assert.match(g.slug, /^[a-z0-9-]{3,90}$/);
		assert.ok(!slugs.has(g.slug), `two guides at ${g.slug}`);
		slugs.add(g.slug);
		assert.ok(g.title.length <= 70, `${g.slug}: title ${g.title.length}`);
		assert.ok(
			g.description.length >= 100 && g.description.length <= 158,
			`${g.slug}: description ${g.description.length}`
		);
		assert.match(g.published, /^\d{4}-\d{2}-\d{2}$/);
		assert.ok(g.updated >= g.published, `${g.slug}: updated before published`);
		assert.ok(
			channel.videos.some((v: { id: string }) => v.id === g.songId),
			`${g.slug}: no song ${g.songId}`
		);
		assert.ok(g.sections.length >= 2 && g.sections.every((s) => s.blocks.length));
		assert.ok(g.sources.length >= 2 && g.sources.every((s) => s.url.startsWith('https://')));
		const words = [g.lead, ...g.sections.flatMap((s) => s.blocks.map((b) => JSON.stringify(b)))]
			.join(' ')
			.split(/\s+/).length;
		assert.ok(words >= 500, `${g.slug}: only ${words} words`);
	}
});

test('a song finds its guides', () => {
	assert.deepEqual(
		guidesForSong('nvQ1vsDZJds').map((g) => g.slug),
		['co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie']
	);
	assert.deepEqual(
		guidesForSong('qnCfU16epew').map((g) => g.slug),
		['czytanie-dziecku-jak-zaczac-20-minut-dziennie']
	);
	assert.deepEqual(guidesForSong('nie-ma'), []);
});
