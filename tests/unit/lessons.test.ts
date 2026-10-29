import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LESSONS, lessonForSong, minutesOf } from '../../src/lib/lessons.ts';
import { withDate } from '../../src/lib/days.ts';

// The channel's videos as read from the YouTube API on 2026-10-24, with the songs of 2026-10-28 and 29
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
		// With the longest date there is ("11 lutego 2027") and with none ("luty")
		for (const now of ['2026-10-24T10:00:00Z', '2030-03-01T10:00:00Z']) {
			const d = withDate(l.description, l.day, new Date(now));
			assert.ok(d.length >= 100 && d.length <= 158, `${l.slug}: description ${d.length}`);
			assert.ok(!d.includes('{data}'), `${l.slug}: {data} without a day`);
		}
		if (l.title) assert.ok(l.title.length <= 70, `${l.slug}: title ${l.title.length}`);
		assert.ok(l.goals.length >= 3 && l.materials.length >= 2 && l.steps.length >= 5);
		const minutes = minutesOf(l);
		assert.ok(minutes >= 30 && minutes <= 50, `${l.slug}: ${minutes} minutes`);
		assert.ok(l.coloring.caption.length <= 100, `${l.slug}: caption too long for the sheet`);
	}
	assert.equal(LESSONS.length, 8);
});

test('a song finds its lesson plan', () => {
	assert.equal(lessonForSong('i65ad55Mk14')?.slug, 'jeden-jeden-dwa');
	assert.equal(lessonForSong('nie-ma'), undefined);
});

test('the days for lessons have their exact next date', async () => {
	const { dayText, nextDate } = await import('../../src/lib/days.ts');
	const at = (iso: string) => new Date(iso);
	assert.equal(nextDate('112', at('2026-10-24T10:00:00Z')), '2027-02-11');
	assert.equal(nextDate('112', at('2027-02-11T23:30:00Z')), '2028-02-11'); // 00:30 on 12 February in Poland
	assert.equal(nextDate('bezpieczny-internet', at('2026-10-24T10:00:00Z')), '2027-02-09');
	assert.equal(nextDate('ksiazka-dla-dzieci', at('2026-10-29T10:00:00Z')), '2027-04-02');
	assert.equal(nextDate('ksiazka-dla-dzieci', at('2027-04-02T10:00:00Z')), '2027-04-02');
	assert.equal(
		dayText('bezpieczny-internet', at('2026-10-24T10:00:00Z')),
		'Dzień Bezpiecznego Internetu – wtorek, 9 lutego 2027'
	);
	assert.equal(
		dayText('112', at('2026-10-24T10:00:00Z')),
		'Europejski Dzień Numeru Alarmowego 112 – czwartek, 11 lutego 2027'
	);
	// After the last date known: no guess, only where to look
	assert.match(dayText('bezpieczny-internet', at('2027-03-01T10:00:00Z')), /saferinternet\.pl/);
	for (const l of LESSONS) if (l.day) assert.ok(dayText(l.day).length > 30, l.slug);
});
