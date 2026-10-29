/*
 * For kindergartens and the first school years (routes/dla-przedszkoli): a lesson plan for each song, built the same
 * way (a talk, the song, a game, the colouring page, a summary), and a colouring page with Pikselek
 * (components/ColoringPicture.svelte, routes/kolorowanka). The questions for the talk come from lib/songs.ts, the
 * song's rules from its description on YouTube. Text written here and checked by a person before it goes live.
 * No imports beyond types: tests/unit checks these in plain Node.
 */

import type { DayId } from './days';

/** What Pikselek holds or stands by on the colouring page */
export type Scene =
	'drzewo' | 'prezent' | 'monetki' | 'tablet' | 'telefon' | 'hustawka' | 'ksiazki' | 'koparka';

export type Lesson = {
	/** The address: /dla-przedszkoli/<slug> and /kolorowanka/<slug> */
	slug: string;
	/** The song (its YouTube id) */
	songId: string;
	/** "Gdy się zgubię" */
	song: string;
	/** What it is about, for the title: "co zrobić, gdy zgubię się w sklepie" */
	topic: string;
	/** For search results when the lesson is for a day people search for; else "Scenariusz zajęć: <song> – <topic>" */
	title?: string;
	/** ~155 characters, for search results; "{data}" is the next date of `day` (lib/days.ts withDate) */
	description: string;
	goals: string[];
	materials: string[];
	steps: { title: string; minutes: number; text: string }[];
	/** A day of the year the lesson fits, shown with its next date (lib/days.ts) */
	day?: DayId;
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
		// Teachers search for the day: "dzień bezpiecznego internetu przedszkole scenariusz"
		title: 'Dzień Bezpiecznego Internetu w przedszkolu – scenariusz zajęć',
		description:
			'Scenariusz zajęć na Dzień Bezpiecznego Internetu ({data}) dla przedszkola: piosenka „Klik z głową”, zabawa „Klikam czy pytam?” i kolorowanka.',
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
		day: 'bezpieczny-internet',
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
		title: 'Dzień 112 w przedszkolu – scenariusz zajęć o numerze alarmowym',
		description:
			'Scenariusz zajęć na Dzień 112 ({data}) dla przedszkola: kiedy dzwonić, co powiedzieć, adres na pamięć. Piosenka, zabawa w telefon i kolorowanka.',
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
		day: '112',
		coloring: {
			scene: 'telefon',
			caption: 'Dzwonię pod 112. Mówię, co się stało i gdzie, i nie rozłączam się.'
		}
	},
	{
		slug: 'raz-ja-raz-ty',
		songId: 'H2DUlYqnVVs',
		song: 'Raz ja, raz ty',
		topic: 'czekanie na swoją kolej i dzielenie się',
		description:
			'Scenariusz zajęć dla przedszkola o czekaniu na swoją kolej i dzieleniu się: piosenka, wieża z klocków na zmianę, zabawa z minutnikiem i kolorowanka.',
		goals: [
			'Dziecko wie, że na huśtawce, na zjeżdżalni i w grze każdy ma swoją kolej.',
			'Dziecko zna sposoby na czekanie: liczenie, minutnik, inna zabawa na chwilę.',
			'Dziecko potrafi zapytać: „Mogę z tobą?” albo „Teraz ja?”, zamiast zabierać zabawkę.'
		],
		materials: [
			'Teledysk „Raz ja, raz ty” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki',
			'Duże klocki, po kilka dla każdej grupy',
			'Minutnik albo klepsydra i jedna ciekawa zabawka, np. bębenek'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pytamy: „Co robicie, gdy wszyscy chcą na jedną huśtawkę?”, „Jak się czujecie, gdy trzeba długo czekać?”. Mówimy, że czekanie bywa trudne dla wszystkich, także dla dorosłych, i że dziś poznamy sposoby, żeby było łatwiej.'
			},
			SONG_STEP('Raz ja, raz ty'),
			{
				title: 'Rozmowa o zasadach',
				minutes: 5,
				text: 'Dzieci odpowiadają na pytania do piosenki. Nauczyciel rysuje na tablicy pięć zasad: czekam w kolejce, liczę „raz, dwa, trzy”, pytam „Mogę z tobą?”, dzielę się na pół, a gdy mi trudno, proszę dorosłego o pomoc.'
			},
			{
				title: 'Wieża na zmianę',
				minutes: 7,
				text: 'W grupach po 3–4 dzieci budujemy wieżę z klocków: każdy dokłada po jednym, a wszyscy mówią „raz ja, raz ty”. Gdy wieża się przewróci, zaczynamy od nowa, od następnego dziecka. Chwalimy czekanie i podawanie klocków.'
			},
			{
				title: 'Zabawa z minutnikiem',
				minutes: 5,
				text: 'Jedna ciekawa zabawka i minutnik. Dziecko bawi się, aż minutnik zadzwoni, a potem samo podaje zabawkę następnemu i mówi: „Teraz ty”. Pozostałe dzieci w tym czasie liczą głośno albo wyklaskują rytm z piosenki, żeby czekanie szybciej mijało.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci mówią, co pomaga czekać, i jeszcze raz śpiewają refren. Rodzicom przekazujemy kolorowankę i adres bajkidlabajtli.pl/poradnik z poradnikiem o czekaniu na swoją kolej i dzieleniu się.'
			}
		],
		coloring: {
			scene: 'hustawka',
			caption: 'Raz ja, raz ty! Gdy czekam na swoją kolej, liczę: raz, dwa, trzy.'
		}
	},
	{
		slug: 'czytaj-ze-mna',
		songId: 'qnCfU16epew',
		song: 'Czytaj ze mną',
		topic: 'wspólne czytanie i biblioteka',
		title: 'Dzień Książki dla Dzieci w przedszkolu – scenariusz zajęć',
		description:
			'Scenariusz zajęć na Międzynarodowy Dzień Książki dla Dzieci ({data}): piosenka, czytanie z pytaniami, zabawa w bibliotekę i kolorowanka.',
		goals: [
			'Dziecko wie, że książki można czytać z dorosłym codziennie, i umie o to poprosić: „Poczytasz mi?”.',
			'Dziecko wie, czym jest biblioteka: książki się wypożycza, a potem oddaje.',
			'Dziecko opowiada o ulubionej książce i słucha, o czym są książki innych dzieci.'
		],
		materials: [
			'Teledysk „Czytaj ze mną” (ekran i głośnik)',
			'Kolorowanka z Pikselkiem dla każdego dziecka',
			'Kredki',
			'Książki z obrazkami (najlepiej przyniesione przez dzieci) i jedna krótka do głośnego czytania',
			'Do zabawy w bibliotekę: pudełko albo półka na książki, kartoniki jako karty biblioteczne, pieczątka'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Dzieci siadają w kole ze swoimi książkami. Pytamy: „Kto wam czyta w domu?”, „Jaką książkę lubicie najbardziej?”. Kilkoro dzieci pokazuje swoją książkę i mówi jednym zdaniem, o czym jest.'
			},
			SONG_STEP('Czytaj ze mną'),
			{
				title: 'Rozmowa o zasadach',
				minutes: 5,
				text: 'Dzieci odpowiadają na pytania do piosenki. Przypominamy, gdzie Pikselek czytał: w domu z mamą, u babci i dziadka, w przedszkolu, w bibliotece i w księgarni. Na tablicy zapisujemy: czytamy razem codziennie, prosimy „Poczytacie?”, w bibliotece książki wypożyczamy i oddajemy.'
			},
			{
				title: 'Czytanie z pytaniami',
				minutes: 8,
				text: 'Nauczyciel czyta krótką książkę z obrazkami i zatrzymuje się przy obrazkach: „Co tu się dzieje?”, „Jak myślicie, co będzie dalej?”. Dzieci odgrywają głosy postaci, a przy przewracaniu stron mówią razem „szu, szu, szu”, jak w piosence.'
			},
			{
				title: 'Zabawa w bibliotekę',
				minutes: 5,
				text: 'Jedno dziecko jest bibliotekarzem z pieczątką, pozostałe po kolei „wypożyczają” książkę: pokazują kartę, mówią „Poproszę tę książkę”, a bibliotekarz stawia pieczątkę: stuk! Na koniec wszyscy oddają książki na półkę i zmieniamy bibliotekarza.'
			},
			COLORING_STEP,
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Dzieci razem mówią „Codziennie czytamy razem” i śpiewają refren. Rodzicom przekazujemy kolorowankę, adres bajkidlabajtli.pl/poradnik z poradnikiem o codziennym czytaniu i, jeśli się da, adres najbliższej biblioteki dla dzieci.'
			}
		],
		day: 'ksiazka-dla-dzieci',
		coloring: {
			scene: 'ksiazki',
			caption: 'Codziennie czytamy razem. Proszę mamę i tatę: „Poczytacie?”'
		}
	},
	{
		slug: 'koparka-gienia-kop-kop-kop',
		songId: '66hgC7tb7Dk',
		song: 'Koparka Gienia',
		topic: 'maszyny na budowie i praca razem',
		description:
			'Scenariusz zajęć dla przedszkola o koparce i budowie: piosenka z ruchem, zabawa w maszyny budowlane, wspólny plac zabaw z klocków i kolorowanka.',
		goals: [
			'Dziecko pokazuje ruchem refren piosenki: łyżka w górę, łyżka w dół.',
			'Dziecko nazywa kilka maszyn z budowy (koparka, dźwig, wywrotka) i naśladuje ich dźwięki.',
			'Dziecko buduje coś razem z innymi i wie, że razem praca idzie raźniej.',
			'Dziecko wie, że na budowę się nie wchodzi, a maszyny ogląda się z daleka, z dorosłym.'
		],
		materials: [
			'Teledysk „Koparka Gienia – Kop, kop, kop!” (ekran i głośnik)',
			'Kolorowanka z koparką i Pikselkiem dla każdego dziecka',
			'Kredki',
			'Obrazki maszyn: koparka, dźwig, wywrotka, betoniarka',
			'Duże klocki, pudełka albo kartony do budowania'
		],
		steps: [
			{
				title: 'Rozmowa na początek',
				minutes: 5,
				text: 'Pokazujemy obrazki maszyn i pytamy: „Co to za maszyna? Co robi? Jak brzmi?”. Dzieci naśladują dźwięki: brum, brum, a przy cofaniu piii, piii. Pytamy, kto widział budowę w swojej okolicy i co tam powstawało.'
			},
			{
				title: 'Piosenka z ruchem',
				minutes: 5,
				text: 'Oglądamy teledysk „Koparka Gienia – Kop, kop, kop!”. Za drugim razem dzieci wstają i pokazują refren: ręce w górę jak łyżka koparki, potem w dół, kopiemy dół. Tekst pojawia się na ekranie, więc starsze dzieci mogą czytać.'
			},
			{
				title: 'Zabawa „Maszyny na budowie”',
				minutes: 6,
				text: 'Dzieci chodzą po sali przy muzyce. Na hasło zmieniają się w maszynę: „Koparka!” (ręce w górę i w dół), „Dźwig!” (jedna ręka wysoko, powolny obrót), „Wywrotka!” (przysiad i wysypywanie). Na „Stop, budowa!” wszyscy stoją bez ruchu.'
			},
			{
				title: 'Budujemy plac zabaw razem',
				minutes: 8,
				text: 'W grupach dzieci budują z klocków i pudełek plac zabaw, jak Gienia z przyjaciółmi: jedna grupa zjeżdżalnię, druga huśtawkę, trzecia piaskownicę. Na koniec łączymy wszystko w jeden plac i oglądamy, co powstało, gdy każdy dołożył swoją część.'
			},
			{
				title: 'Rozmowa o bezpieczeństwie',
				minutes: 3,
				text: 'Mówimy krótko: na prawdziwą budowę się nie wchodzi, nawet gdy nikt nie pracuje, a maszyny oglądamy z daleka, zza płotu i z dorosłym. Operator koparki z wysokiej kabiny może nie zauważyć małego dziecka.'
			},
			{
				title: 'Kolorowanka',
				minutes: 10,
				text: 'Dzieci kolorują koparkę i Pikselka, który pokazuje „łyżka w górę”, a nauczyciel czyta podpis z dołu karty. Starsze dzieci mogą dorysować, co koparka zbudowała.'
			},
			{
				title: 'Podsumowanie',
				minutes: 3,
				text: 'Jeszcze raz śpiewamy refren z ruchem. Rodzicom przekazujemy kolorowankę i adres bajkidlabajtli.pl/dla-rodzicow: na spacerze obok budowy można razem nazywać maszyny i naśladować ich dźwięki.'
			}
		],
		coloring: {
			scene: 'koparka',
			caption: 'Łyżka w górę, łyżka w dół! Razem z przyjaciółmi praca idzie raźniej.'
		}
	}
];

export const lessonOf = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonForSong = (id: string) => LESSONS.find((l) => l.songId === id);
/** All the minutes of a lesson's steps */
export const minutesOf = (l: Lesson) => l.steps.reduce((sum, s) => sum + s.minutes, 0);
