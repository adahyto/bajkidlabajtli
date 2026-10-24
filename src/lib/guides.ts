/*
 * Guides for parents (routes/poradnik): one question parents search for, answered with the song that teaches the
 * child the same, its questions for a talk (lib/songs.ts) and the sources of the advice. A guide is text written
 * here and checked by a person before it goes live; `updated` changes with every change of what it says.
 * No imports beyond types: tests/unit checks these in plain Node.
 */

export type Block =
	| { kind: 'p'; text: string }
	/** Numbered steps with a short name each: what a child or a parent does, in order */
	| { kind: 'steps'; items: { title: string; text: string }[] }
	| { kind: 'list'; items: string[] }
	/** Set apart: what to remember, or what to do in danger */
	| { kind: 'note'; text: string };

export type Guide = {
	slug: string;
	/** The question, as parents ask it: the H1 and the title in search results */
	title: string;
	/** For cards and links */
	short: string;
	/** ~155 characters, for search results */
	description: string;
	/** The song that teaches the child the same (its YouTube id) */
	songId: string;
	published: string;
	updated: string;
	lead: string;
	sections: { heading: string; blocks: Block[] }[];
	sources: { name: string; url: string }[];
};

export const GUIDES: Guide[] = [
	{
		slug: 'co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie',
		title: 'Co zrobić, gdy dziecko zgubi się w sklepie?',
		short: 'Gdy dziecko zgubi się w sklepie',
		description:
			'Co ma zrobić dziecko, gdy się zgubi, a co rodzic w pierwszych minutach. Jak przećwiczyć to w domu, z piosenką „Gdy się zgubię” i pytaniami do rozmowy.',
		songId: 'nvQ1vsDZJds',
		published: '2026-10-24',
		updated: '2026-10-24',
		lead: 'Wystarczy chwila przy półce, żeby dziecko zniknęło z oczu. Takie zgubienie się najczęściej kończy się szybko, pod warunkiem że dziecko i rodzic mają ten sam prosty plan: ustalony wcześniej, w domu, a nie w chwili strachu. Oto plan w pięciu krokach dla dziecka i w czterech dla rodzica, z piosenką, która pomaga go zapamiętać.',
		sections: [
			{
				heading: 'Plan dla dziecka: pięć kroków',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Stój jak drzewo',
								text: 'Zostań tam, gdzie jesteś, i nie szukaj sam. Rodzic, który zauważy, że dziecka nie ma, najpierw wraca do miejsca, w którym ostatnio je widział. Jeśli dziecko chodzi po sklepie, łatwo się mijają.'
							},
							{
								title: 'Wołaj głośno',
								text: '„Mamo! Tato!” albo imię opiekuna. W sklepie wolno krzyczeć, kiedy się zgubisz: powiedzcie dziecku wprost, że to nie jest niegrzeczne.'
							},
							{
								title: 'Poproś o pomoc właściwą osobę',
								text: 'Panią przy kasie, pana z ochrony albo mamę z dziećmi. Do kasy można podejść od razu, bez stania w kolejce. Wystarczy powiedzieć: „Przepraszam, zgubiłem się. Pomoże mi pani?”. Jeśli ktoś nie słucha, trzeba poprosić następną osobę.'
							},
							{
								title: 'Powiedz, jak się nazywasz',
								text: 'Imię i nazwisko, a starsze dziecko także numer telefonu mamy lub taty. Pracownik sklepu ogłosi to przez głośniki albo zadzwoni do rodzica.'
							},
							{
								title: 'Nie wychodź ze sklepu',
								text: 'Nawet z kimś, kto jest miły i mówi, że zaprowadzi do mamy. Pomoc jest w sklepie, a rodzic szuka właśnie tam.'
							}
						]
					}
				]
			},
			{
				heading: 'Plan dla rodzica: pierwsze minuty',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Wróć tam, gdzie ostatnio widziałeś dziecko',
								text: 'Rozejrzyj się i wołaj je po imieniu. Jeśli znacie zasadę „stój jak drzewo”, dziecko powinno być niedaleko tego miejsca.'
							},
							{
								title: 'Od razu powiedz pracownikowi sklepu albo ochronie',
								text: 'Podaj imię, wiek i wygląd dziecka, a jeśli masz, pokaż jego zdjęcie z tego dnia. Sklepy i centra handlowe mają na takie sytuacje procedury: ogłoszenia przez głośniki, monitoring, ochrona przy wyjściach.'
							},
							{
								title: 'Nie czekaj z telefonem na 112',
								text: 'Możesz zadzwonić w każdej chwili, nie musisz czekać, aż sklep skończy swoje poszukiwania. Fundacja ITAKA radzi zawiadomić policję jak najszybciej, jeśli dziecka nie uda się znaleźć w ciągu kilkunastu minut. Nie ma żadnej zasady, że trzeba odczekać 24 godziny.'
							},
							{
								title: 'Zostań w kontakcie',
								text: 'Miej przy sobie naładowany telefon z włączonym dzwonkiem: to na niego zadzwoni pracownik sklepu, któremu dziecko poda numer.'
							}
						]
					},
					{
						kind: 'note',
						text: 'Gdy dziecka nie ma dłużej: 112 (policja, każda sytuacja zagrożenia) i 116 000, Telefon w Sprawie Zaginionego Dziecka i Nastolatka prowadzony przez Fundację ITAKA, gdzie rodzice dostają pomoc i wsparcie.'
					}
				]
			},
			{
				heading: 'Zanim pójdziecie na zakupy',
				blocks: [
					{
						kind: 'list',
						items: [
							'Umówcie się, gdzie się spotkacie, jeśli się zgubicie, np. przy kasie najbliżej wejścia. W każdym nowym miejscu ustalcie to od nowa.',
							'Przypomnijcie plan przed wyjściem do dużego sklepu, galerii albo na festyn. Dla małego dziecka tydzień to dużo, więc zasady trzeba odświeżać.',
							'Pomóżcie dziecku nauczyć się na pamięć imienia i nazwiska, a starszemu także numeru telefonu. Młodszemu dziecku możecie zapisać numer na ręce albo na opasce.',
							'Zróbcie rano zdjęcie dziecka w tym, w co jest ubrane. W stresie trudno opisać, jakiego koloru była kurtka.',
							'Nie straszcie dziecka policjantem ani ochroniarzem („bo cię zabierze”). Ma się nie bać poprosić ich o pomoc.'
						]
					}
				]
			},
			{
				heading: 'Przećwiczcie to w domu, jak zabawę',
				blocks: [
					{
						kind: 'p',
						text: 'Zasady z rozmowy łatwo wylatują z głowy. Lepiej działa zabawa: jedna osoba się „gubi”, dziecko staje jak drzewo i woła, a potem prosi o pomoc „panią przy kasie”, którą gra drugi rodzic albo pluszak. Niech dziecko samo powie zdanie „Przepraszam, zgubiłem się” i swoje imię. Starsze dziecko może opowiedzieć Wam cały plan swoimi słowami.'
					},
					{
						kind: 'p',
						text: 'Pomaga też piosenka. W „Gdy się zgubię” Pikselek goni balon w wielkim sklepie i nagle zostaje sam, a refren „Stój jak drzewo” zostaje w głowie na długo. Posłuchajcie jej razem, a potem porozmawiajcie: pytania są niżej.'
					}
				]
			}
		],
		sources: [
			{
				name: 'Kidpower: Getting Lost (plan dla dzieci, ćwiczenia)',
				url: 'https://kidpower.org/library/article/getting-lost'
			},
			{
				name: 'Gazeta Prawna: Co robić, gdy w sklepie zaginie dziecko',
				url: 'https://www.gazetaprawna.pl/twoje-prawo/artykuly/10845459,zaginiecie-dziecka-w-sklepie.html'
			},
			{
				name: 'PAP: Fundacja ITAKA o szybkiej reakcji na zaginięcie dziecka',
				url: 'https://www.pap.pl/aktualnosci/fundacja-itaka-szybka-reakcja-na-zaginiecie-dziecka-wieksza-szansa-na-szczesliwe'
			},
			{ name: 'Fundacja ITAKA: zaginieni.pl, telefon 116 000', url: 'https://zaginieni.pl/' }
		]
	}
];

export const guideOf = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidesForSong = (id: string) => GUIDES.filter((g) => g.songId === id);
