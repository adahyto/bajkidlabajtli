/*
 * Days of the year that suit the songs (lib/lessons.ts, routes/dla-przedszkoli), shown with the exact date of the
 * next one. The 112 Day is 11 February every year, International Children's Book Day 2 April (IBBY, Andersen's
 * birthday). Safer Internet Day moves (2024: 6 February, 2025: 11 February,
 * 2026: 10 February), so its dates are the organisers' (better-internet-for-kids.europa.eu, in Poland
 * saferinternet.pl); after the last one known the text says where to look instead of guessing. Add the next date
 * when it is announced, usually a year ahead.
 * No imports beyond types: tests/unit checks this in plain Node.
 */

export type DayId = 'bezpieczny-internet' | '112' | 'ksiazka-dla-dzieci';

const NAMES: Record<DayId, string> = {
	'bezpieczny-internet': 'Dzień Bezpiecznego Internetu',
	'112': 'Europejski Dzień Numeru Alarmowego 112',
	'ksiazka-dla-dzieci': 'Międzynarodowy Dzień Książki dla Dzieci'
};

/** The days on the same date every year, MM-DD */
const EVERY_YEAR: Partial<Record<DayId, string>> = {
	'112': '02-11',
	'ksiazka-dla-dzieci': '04-02'
};

/** Safer Internet Day: "the global day of focus will take place on Tuesday, 9 February 2027" (BIK) */
const SAFER_INTERNET = ['2027-02-09'];

/** Today in Poland, YYYY-MM-DD */
const today = (now: Date) => now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });

/** The next day (today counts), YYYY-MM-DD, or null when it is not known yet */
export function nextDate(id: DayId, now = new Date()): string | null {
	const from = today(now);
	const day = EVERY_YEAR[id];
	if (day) {
		const year = Number(from.slice(0, 4));
		return `${year}-${day}` >= from ? `${year}-${day}` : `${year + 1}-${day}`;
	}
	return SAFER_INTERNET.find((d) => d >= from) ?? null;
}

/** "9 lutego 2027" */
export const shortDate = (date: string) =>
	new Intl.DateTimeFormat('pl-PL', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Europe/Warsaw'
	}).format(new Date(`${date}T12:00:00Z`));

/**
 * A text for search results with "{data}" for the day's next date: "…na Dzień 112 ({data})…" → "(11 lutego 2027)";
 * "luty" when the date is not known yet
 */
export function withDate(text: string, id: DayId | undefined, now = new Date()): string {
	if (!id) return text;
	const date = nextDate(id, now);
	return text.replace('{data}', date ? shortDate(date) : 'luty');
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
