/*
 * What the site adds to a song that YouTube does not have, by the video's id: a short topic for its card, questions
 * for a talk after the song and its words. Everything else (title, rules, tips for parents) comes from YouTube
 * (lib/server/youtube.ts, lib/server/description.ts), so a new song shows without an entry here, only without these.
 * A short shows what its full song has. The questions follow the rules in the songs' descriptions.
 */

export type SongExtra = {
	/** On the song's card: "W sklepie" */
	topic?: string;
	/** For a talk with the child after the song */
	questions?: string[];
	/** The words of the song, verses separated by an empty line */
	lyrics?: string;
};

export const SONGS: Record<string, SongExtra> = {
	// Klik z głową
	ALro8KR2sZw: {
		topic: 'Internet',
		questions: [
			'Czego nie mówimy w internecie nieznajomym?',
			'Co zrobisz, gdy na ekranie wyskoczy okienko „Wygrałeś!”?',
			'Do kogo przyjdziesz, gdy w tablecie zobaczysz coś dziwnego albo strasznego?'
		]
	},
	// Gdy się zgubię
	nvQ1vsDZJds: {
		topic: 'W sklepie',
		questions: [
			'Co robi drzewo? A co Ty zrobisz, gdy zgubisz się w sklepie?',
			'Kogo w sklepie możesz poprosić o pomoc?',
			'Jak się nazywasz? A znasz numer telefonu mamy albo taty?'
		]
	},
	// Złote monetki
	Habi9u9igtI: {
		topic: 'Zakupy w grach',
		questions: [
			'Czy monetki w grze są za darmo?',
			'Co zrobisz, zanim coś kupisz w grze?',
			'Gdy gra woła „Tylko dziś!”, to trzeba się spieszyć?'
		]
	},
	// Niespodzianka tak, sekret nie
	x9ulnPUktvw: {
		topic: 'Sekrety',
		questions: [
			'Czym niespodzianka różni się od sekretu?',
			'Komu powiesz o sekrecie, przez który jest Ci smutno albo dziwnie?',
			'Czy możesz powiedzieć „nie”, gdy ktoś chce Cię dotknąć, a Ty tego nie chcesz?'
		]
	}
};
