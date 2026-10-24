/*
 * For kindergartens and the first school years (routes/dla-przedszkoli): a lesson plan for each song, built the same
 * way (a talk, the song, a game, the colouring page, a summary), and a colouring page with Pikselek
 * (components/ColoringPicture.svelte, routes/kolorowanka). The questions for the talk come from lib/songs.ts, the
 * song's rules from its description on YouTube. Text written here and checked by a person before it goes live.
 * No imports beyond types: tests/unit checks these in plain Node.
 */

/** What Pikselek holds or stands by on the colouring page */
export type Scene = 'drzewo' | 'prezent' | 'monetki' | 'tablet' | 'telefon';

export type Lesson = {
	/** The address: /dla-przedszkoli/<slug> and /kolorowanka/<slug> */
	slug: string;
	/** The song (its YouTube id) */
	songId: string;
	/** "Gdy się zgubię" */
	song: string;
	/** What it is about, for the title: "co zrobić, gdy zgubię się w sklepie" */
	topic: string;
	/** ~155 characters, for search results */
	description: string;
	goals: string[];
	materials: string[];
	steps: { title: string; minutes: number; text: string }[];
	/** A day of the year the lesson fits */
	day?: string;
	coloring: { scene: Scene; caption: string };
};

const SONG_STEP = (song: string) => ({
	title: 'Piosenka',
	minutes: 5,
	text: `Obejrzyjcie teledysk „${song}” na tablicy interaktywnej, telewizorze albo laptopie. Za drugim razem dzieci śpiewają refren i pokazują go ruchem. Tekst pojawia się na ekranie, więc starsze dzieci mogą czytać.`
});

const COLORING_STEP = {
	title: 'Kolorowanka',
	minutes: 10,
	text: 'Dzieci kolorują Pikselka, a nauczyciel czyta zasadę z dołu karty. Starsze dzieci mogą dopisać albo dorysować, co zrobią w tej sytuacji.'
};

export const LESSONS: Lesson[] = [
	{
		slug: 'gdy-sie-zgubie',
		songId: 'nvQ1vsDZJds',
		song: 'Gdy się zgubię',
		topic: 'co zrobić, gdy zgubię się w sklepie',
		description:
			'Scenariusz zajęć dla przedszkola: co zrobić, gdy dziecko zgubi się w sklepie. Piosenka, zabawa „Stój jak drzewo”, scenka przy kasie i kolorowanka.',
		goals: [
			'Dziecko wie, że gdy się zgubi, zostaje w miejscu i głośno woła opiekuna.',
			'Dziecko wie, kogo w sklepie może poprosić o pomoc: osobę przy kasie, ochroniarza, mamę z dziećmi.',
			'Dziecko potrafi powiedzieć swoje imię i nazwisko, a starsze także numer telefonu rodzica.'
		],
		materials: [
			'Teledysk „Gdy się zgubię” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki',
			'Do scenki: stolik jako kasa, kilka produktów, tabliczka „KASA”'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pytamy: „Czy ktoś z was kiedyś zgubił się albo nie widział mamy w sklepie? Co wtedy czuliście?”. Mówimy, że to się zdarza i że dziś nauczymy się, co wtedy zrobić.'
			},
			SONG_STEP('Gdy się zgubię'),
			{
				title: 'Rozmowa o zasadach',
				minutes: 5,
				text: 'Dzieci odpowiadają na pytania do piosenki. Nauczyciel zapisuje albo rysuje na tablicy pięć zasad: stój jak drzewo, wołaj głośno, poproś o pomoc, powiedz, jak się nazywasz, nie wychodź z nieznajomym.'
			},
			{
				title: 'Zabawa ruchowa „Stój jak drzewo”',
				minutes: 5,
				text: 'Dzieci chodzą po sali przy muzyce. Na hasło „Zgubiłem się!” zatrzymują się, stają jak drzewo (stopy mocno na ziemi, ręce jak gałęzie) i głośno wołają „Mamo! Tato!”.'
			},
			{
				title: 'Scenka „Przy kasie”',
				minutes: 5,
				text: 'Nauczyciel jest panią przy kasie. Dzieci po kolei podchodzą i mówią: „Przepraszam, zgubiłem się. Nazywam się…”. Chwalimy głośne, wyraźne mówienie i podanie imienia i nazwiska.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci razem mówią zasady i jeszcze raz śpiewają refren. Rodzicom przekazujemy kolorowankę i adres bajkidlabajtli.pl/dla-rodzicow z pytaniami do rozmowy w domu.'
			}
		],
		coloring: {
			scene: 'drzewo',
			caption: 'Gdy się zgubię, stoję jak drzewo i głośno wołam: Mamo! Tato!'
		}
	},
	{
		slug: 'niespodzianka-tak-sekret-nie',
		songId: 'x9ulnPUktvw',
		song: 'Niespodzianka tak, sekret nie',
		topic: 'dobre i złe sekrety',
		description:
			'Scenariusz zajęć dla przedszkola o niespodziankach i złych sekretach: piosenka, zabawa „Niespodzianka czy sekret?”, dłoń zaufania i kolorowanka.',
		goals: [
			'Dziecko odróżnia niespodziankę (radosną, krótką) od złego sekretu (przez który jest smutno albo dziwnie).',
			'Dziecko wie, że złego sekretu się nie trzyma i mówi o nim zaufanemu dorosłemu.',
			'Dziecko wie, że może powiedzieć „nie” dotykowi, którego nie chce.'
		],
		materials: [
			'Teledysk „Niespodzianka tak, sekret nie” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki, kartki A4 do obrysowania dłoni'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pytamy: „Kto szykował dla kogoś niespodziankę? Jak się wtedy czuliście?”. Zbieramy radosne przykłady: laurka, prezent, przyjęcie.'
			},
			SONG_STEP('Niespodzianka tak, sekret nie'),
			{
				title: 'Rozmowa o zasadach',
				minutes: 5,
				text: 'Dzieci odpowiadają na pytania do piosenki. Podkreślamy: niespodzianka jest radosna i niedługo wszyscy się o niej dowiedzą, a sekret, przez który jest smutno albo dziwnie, mówimy zaufanemu dorosłemu i nikt nie będzie się za to złościł. Mówimy spokojnie, bez straszenia.'
			},
			{
				title: 'Zabawa „Niespodzianka czy sekret?”',
				minutes: 5,
				text: 'Nauczyciel czyta krótkie sytuacje. Przy niespodziance dzieci podskakują z radości, przy złym sekrecie podnoszą rękę: „Powiem dorosłemu!”. Przykłady: laurka dla mamy; kolega zabrał zabawkę i mówi „nie mów pani”; prezent dla babci w szafie; ktoś mówi „to nasz sekret, nikomu nie mów”.'
			},
			{
				title: 'Dłoń zaufania',
				minutes: 5,
				text: 'Dzieci obrysowują swoją dłoń, a w palcach rysują albo wpisują (z pomocą) pięć osób, którym mogą powiedzieć o złym sekrecie. Pilnujemy, żeby wśród nich był ktoś spoza domu, np. pani w przedszkolu.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci kończą zdanie: „Zły sekret mówię…”. Dłonie zaufania i kolorowanki zabierają do domu, a rodzicom przekazujemy adres bajkidlabajtli.pl/dla-rodzicow, gdzie jest poradnik o dobrych i złych sekretach.'
			}
		],
		coloring: {
			scene: 'prezent',
			caption: 'Niespodzianka jest radosna. Zły sekret mówię zaufanemu dorosłemu.'
		}
	},
	{
		slug: 'zlote-monetki',
		songId: 'Habi9u9igtI',
		song: 'Złote monetki',
		topic: 'zakupy w grach',
		description:
			'Scenariusz zajęć dla przedszkola i klas 1–3 o zakupach w grach: monetki to prawdziwe pieniądze. Piosenka, zabawa w sklepik, sztuczki gier i kolorowanka.',
		goals: [
			'Dziecko wie, że monetki i diamenty w grach kosztują prawdziwe pieniądze.',
			'Dziecko wie, że zanim coś kupi w grze, pyta rodzica.',
			'Dziecko rozpoznaje sztuczki gier: „Tylko dziś!”, tykający zegar, „Wszyscy mają!”.'
		],
		materials: [
			'Teledysk „Złote monetki” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki, liczmany albo papierowe monetki',
			'Trzy kartki z napisami: „KUP!”, „TYLKO DZIŚ!”, „WSZYSCY MAJĄ!”'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pytamy: „Kto gra w gry na tablecie albo telefonie? Czy w grze można coś kupić?”. Nie oceniamy, tylko zbieramy doświadczenia dzieci.'
			},
			SONG_STEP('Złote monetki'),
			{
				title: 'Rozmowa o zasadach',
				minutes: 5,
				text: 'Dzieci odpowiadają na pytania do piosenki. Wyjaśniamy prosto: za monetki w grze ktoś płaci prawdziwymi pieniędzmi z karty mamy albo taty.'
			},
			{
				title: 'Zabawa „Sklepik z monetkami”',
				minutes: 5,
				text: 'Każde dziecko dostaje kilka liczmanów-monetek. Nauczyciel jest „grą” i podnosi kartki „KUP!”, „TYLKO DZIŚ!”, „WSZYSCY MAJĄ!”, a dzieci zamiast płacić wołają: „Najpierw pytam!”. Starsze dzieci liczą, ile monetek by wydały.'
			},
			{
				title: 'Sztuczki gier',
				minutes: 5,
				text: 'Razem nazywamy sztuczki: pośpiech („Tylko dziś!”, zegar), zazdrość („Wszyscy mają!”), monetki zamiast złotówek. Dzieci wymyślają, co powie Pikselek, gdy gra go kusi.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci powtarzają: „Zanim coś kupię w grze, pytam mamę albo tatę”. Rodzicom przekazujemy adres bajkidlabajtli.pl/dla-rodzicow, gdzie jest poradnik, jak zablokować zakupy w grach.'
			}
		],
		coloring: {
			scene: 'monetki',
			caption:
				'Monetki w grach kosztują prawdziwe pieniądze. Zanim coś kupię, pytam mamę albo tatę.'
		}
	},
	{
		slug: 'klik-z-glowa',
		songId: 'ALro8KR2sZw',
		song: 'Klik z głową',
		topic: 'bezpieczny internet',
		description:
			'Scenariusz zajęć dla przedszkola o bezpiecznym internecie: piosenka, zabawa „Klikam czy pytam?”, zasady dla małych internautów i kolorowanka.',
		goals: [
			'Dziecko wie, że w internecie nie podaje adresu, imienia i nazwiska ani nazwy przedszkola.',
			'Dziecko wie, że nie klika w okienka „Wygrałeś!” i nie wysyła zdjęć nieznajomym.',
			'Dziecko wie, że z każdą dziwną albo straszną rzeczą idzie do dorosłego.'
		],
		materials: [
			'Teledysk „Klik z głową” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki, kilka obrazków albo wydruków: okienko „Wygrałeś!”, znana bajka, czat z pytaniem „Gdzie mieszkasz?”'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pytamy: „Co robicie na tablecie albo telefonie? Z kim wtedy jesteście?”. Zbieramy odpowiedzi bez oceniania.'
			},
			SONG_STEP('Klik z głową'),
			{
				title: 'Rozmowa o zasadach',
				minutes: 5,
				text: 'Dzieci odpowiadają na pytania do piosenki. Rysujemy na tablicy kilka zasad: nie mówię, kim jestem, nie wysyłam zdjęć, nie klikam w „Wygrałeś!”, pytam mamę albo tatę.'
			},
			{
				title: 'Zabawa „Klikam czy pytam?”',
				minutes: 5,
				text: 'Nauczyciel pokazuje obrazki. Gdy można bezpiecznie kliknąć (znana bajka), dzieci klaszczą. Gdy trzeba zapytać dorosłego (okienko „Wygrałeś!”, ktoś pyta o adres), podnoszą rękę i mówią: „Pytam!”.'
			},
			{
				title: 'Z tabletu na podwórko',
				minutes: 5,
				text: 'Zabawa ruchowa na koniec ekranu: dzieci „wyłączają tablet” (klaszczą w dłonie) i biegną „na podwórko” po sali, a na sygnał wracają. Rozmawiamy, co lubią robić bez ekranu.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci kończą zdanie: „Gdy w internecie zobaczę coś dziwnego, to…”. Rodzicom przekazujemy adres bajkidlabajtli.pl/dla-rodzicow z poradnikiem o bezpiecznym internecie dla przedszkolaka.'
			}
		],
		day: 'luty: Dzień Bezpiecznego Internetu',
		coloring: {
			scene: 'tablet',
			caption: 'W internecie nie mówię, kim jestem. Gdy czegoś nie wiem, pytam mamę albo tatę.'
		}
	},
	{
		slug: 'jeden-jeden-dwa',
		songId: 'i65ad55Mk14',
		song: 'Jeden, jeden, dwa',
		topic: 'numer alarmowy 112',
		description:
			'Scenariusz zajęć dla przedszkola o numerze alarmowym 112: kiedy dzwonić, co powiedzieć, adres na pamięć. Piosenka, zabawa w telefon i kolorowanka.',
		goals: [
			'Dziecko zna numer alarmowy 112 i wie, kiedy się pod niego dzwoni.',
			'Dziecko wie, co powiedzieć: co się stało i gdzie, i że nie rozłącza się.',
			'Dziecko zna (albo zaczyna się uczyć) swój adres albo adres przedszkola.'
		],
		materials: [
			'Teledysk „Jeden, jeden, dwa” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki, zabawkowe telefony albo kartonowe „telefony” z cyframi',
			'Obrazki sytuacji: dym, ktoś upadł, zgubiona zabawka, nuda'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pytamy: „Kto przyjeżdża, gdy ktoś potrzebuje pomocy?”. Mówimy o strażakach, policjantach i ratownikach i o jednym numerze, który ich wzywa: 112.'
			},
			{
				title: 'Piosenka',
				minutes: 5,
				text: 'Oglądamy teledysk „Jeden, jeden, dwa”: Pikselek dzwoni pod 112, gdy babci robi się słabo. Za drugim razem dzieci wystukują rytm 1, 1, 2 na kolanach i śpiewają refren: mówię, co się stało i gdzie, i nie rozłączam się.'
			},
			{
				title: 'Dzwonimy czy nie dzwonimy?',
				minutes: 5,
				text: 'Nauczyciel pokazuje obrazki, a dzieci decydują: dym w kuchni, ktoś upadł i nie odpowiada (dzwonimy), zgubiona zabawka, nuda (nie dzwonimy). Mówimy, dlaczego nie dzwoni się dla zabawy: w tym czasie ktoś inny może czekać na pomoc.'
			},
			{
				title: 'Zabawa w telefon',
				minutes: 5,
				text: 'W parach: jedno dziecko jest „panią z telefonu 112”, drugie mówi, co się stało i gdzie, i czeka, aż „pani” powie, że może się rozłączyć. Ćwiczymy adres przedszkola, a dzieci, które znają, swój adres domowy.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci razem mówią: „Dzwonię pod 112, mówię, co się stało i gdzie, i nie rozłączam się”. Rodzicom przekazujemy adres bajkidlabajtli.pl/dla-rodzicow z poradnikiem, jak ćwiczyć 112 w domu i jak nauczyć dziecko adresu.'
			}
		],
		day: '11 lutego: Europejski Dzień Numeru Alarmowego 112',
		coloring: {
			scene: 'telefon',
			caption: 'Dzwonię pod 112. Mówię, co się stało i gdzie, i nie rozłączam się.'
		}
	}
];

export const lessonOf = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonForSong = (id: string) => LESSONS.find((l) => l.songId === id);
/** All the minutes of a lesson's steps */
export const minutesOf = (l: Lesson) => l.steps.reduce((sum, s) => sum + s.minutes, 0);
