import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LESSONS, lessonForSong, minutesOf } from '../../src/lib/lessons.ts';

// The channel's videos as read from the YouTube API on 2026-10-24
const channel = JSON.parse(
	readFileSync(new URL('../fixtures/channel.json', import.meta.url), 'utf8')
);

test('every lesson plan is complete, ~40 minutes, and fits in search results', () => {
	const slugs = new Set<string>();
	for (const l of LESSONS) {
		assert.match(l.slug, /^[a-z0-9-]{3,90}$/);
		assert.ok(!slugs.has(l.slug), `two lessons at ${l.slug}`);
		slugs.add(l.slug);
		assert.ok(
			channel.videos.some((v: { id: string }) => v.id === l.songId),
			`${l.slug}: no song ${l.songId}`
		);
		assert.ok(
			l.description.length >= 100 && l.description.length <= 158,
			`${l.slug}: description ${l.description.length}`
		);
		assert.ok(l.goals.length >= 3 && l.materials.length >= 2 && l.steps.length >= 5);
		const minutes = minutesOf(l);
		assert.ok(minutes >= 30 && minutes <= 50, `${l.slug}: ${minutes} minutes`);
		assert.ok(l.coloring.caption.length <= 100, `${l.slug}: caption too long for the sheet`);
	}
	assert.equal(LESSONS.length, 5);
});

test('a song finds its lesson plan', () => {
	assert.equal(lessonForSong('Uo1OsJlukhM')?.slug, 'jeden-jeden-dwa');
	assert.equal(lessonForSong('nie-ma'), undefined);
});
