/*
 * Days of the year that suit the songs (lib/lessons.ts, routes/dla-przedszkoli), shown with the exact date of the
 * next one. The 112 Day is 11 February every year. Safer Internet Day moves (2024: 6 February, 2025: 11 February,
 * 2026: 10 February), so its dates are the organisers' (better-internet-for-kids.europa.eu, in Poland
 * saferinternet.pl); after the last one known the text says where to look instead of guessing. Add the next date
 * when it is announced, usually a year ahead.
 * No imports beyond types: tests/unit checks this in plain Node.
 */

export type DayId = 'bezpieczny-internet' | '112';

const NAMES: Record<DayId, string> = {
	'bezpieczny-internet': 'Dzień Bezpiecznego Internetu',
	'112': 'Europejski Dzień Numeru Alarmowego 112'
};

/** Safer Internet Day: "the global day of focus will take place on Tuesday, 9 February 2027" (BIK) */
const SAFER_INTERNET = ['2027-02-09'];

/** Today in Poland, YYYY-MM-DD */
const today = (now: Date) => now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });

/** The next day (today counts), YYYY-MM-DD, or null when it is not known yet */
export function nextDate(id: DayId, now = new Date()): string | null {
	const from = today(now);
	if (id === '112') {
		const year = Number(from.slice(0, 4));
		return `${year}-02-11` >= from ? `${year}-02-11` : `${year + 1}-02-11`;
	}
	return SAFER_INTERNET.find((d) => d >= from) ?? null;
}

/** "wtorek, 9 lutego 2027" */
export const longDate = (date: string) =>
	new Intl.DateTimeFormat('pl-PL', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Europe/Warsaw'
	}).format(new Date(`${date}T12:00:00Z`));

/** The day for a lesson: "Dzień Bezpiecznego Internetu – wtorek, 9 lutego 2027" */
export function dayText(id: DayId, now = new Date()): string {
	const date = nextDate(id, now);
	return date
		? `${NAMES[id]} – ${longDate(date)}`
		: `${NAMES[id]} – w lutym, co roku innego dnia (data na saferinternet.pl)`;
}
