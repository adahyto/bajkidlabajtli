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
	},
	{
		slug: 'dobry-i-zly-sekret-jak-rozmawiac-z-dzieckiem',
		title: 'Dobry i zły sekret – jak rozmawiać o tym z dzieckiem?',
		short: 'Dobry i zły sekret',
		description:
			'Czym niespodzianka różni się od złego sekretu i jak powiedzieć to dziecku bez straszenia. Zasady, rozmowa, zabawa i co zrobić, gdy dziecko powie o sekrecie.',
		songId: 'x9ulnPUktvw',
		published: '2026-10-24',
		updated: '2026-10-24',
		lead: 'Dzieci uwielbiają sekrety, a dorośli często mówią „to nasz sekret” o prezencie czy niespodziance. Kłopot w tym, że tych samych słów używa ktoś, kto chce, żeby dziecko nie powiedziało o czymś, co je skrzywdziło. Dlatego warto nauczyć dziecko prostej różnicy: niespodzianka jest radosna i niedługo wszyscy się o niej dowiedzą, a sekret, przez który jest smutno albo dziwnie, trzeba powiedzieć zaufanemu dorosłemu. Da się o tym rozmawiać spokojnie, bez straszenia i bez trudnych słów.',
		sections: [
			{
				heading: 'Niespodzianka czy sekret: prosta różnica',
				blocks: [
					{
						kind: 'list',
						items: [
							'Niespodzianka to coś miłego dla kogoś innego: laurka dla taty, prezent dla babci, przyjęcie urodzinowe. Jest radosna i trwa krótko, bo niedługo wszyscy się o niej dowiedzą.',
							'Zły sekret to coś, przez co jest smutno, dziwnie albo strasznie. W brzuszku coś ściska, a ktoś mówi: „Nikomu nie mów”, „To nasz mały sekret” albo obiecuje nagrodę za milczenie.',
							'Zasada dla dziecka jest jedna: złego sekretu się nie trzyma. Mówi się o nim mamie, tacie albo innemu zaufanemu dorosłemu, i nikt nie będzie się za to złościł.'
						]
					},
					{
						kind: 'p',
						text: 'Brytyjska organizacja NSPCC, która od lat uczy dzieci zasad bezpieczeństwa ciała, zwraca uwagę, że zdanie „to nasz mały sekret” to jeden ze sposobów, w jaki sprawca sprawia, że dziecko boi się mówić. Dziecko, które zna różnicę między niespodzianką a sekretem, łatwiej rozpozna, że coś jest nie tak.'
					}
				]
			},
			{
				heading: 'Pięć zasad dla dziecka',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Niespodzianka jest radosna',
								text: 'I wkrótce wszyscy się o niej dowiedzą. Taką tajemnicę można trzymać.'
							},
							{
								title: 'Zły sekret to ten, przez który jest smutno albo dziwnie',
								text: 'Liczy się to, co dziecko czuje, a nie to, kto prosi o tajemnicę.'
							},
							{
								title: 'Zły sekret mówię zaufanemu dorosłemu',
								text: 'Mamie, tacie albo innej osobie, którą razem wybraliście: babci, pani w przedszkolu. Jeśli ktoś nie słucha, mówię następnej osobie.'
							},
							{
								title: 'Za powiedzenie nie ma kary ani złości',
								text: 'Nawet jeśli ktoś mówił, że będzie. To nigdy nie jest wina dziecka.'
							},
							{
								title: 'Moje ciało jest moje',
								text: 'Mogę powiedzieć „nie” dotykowi, którego nie chcę, także od bliskich osób, i moje „nie” jest ważne.'
							}
						]
					}
				]
			},
			{
				heading: 'Jak o tym rozmawiać',
				blocks: [
					{
						kind: 'list',
						items: [
							'Przy okazji, a nie na poważnej naradzie: po piosence, przy pakowaniu prezentu, przy czytaniu bajki. Kilka krótkich rozmów zostaje w głowie lepiej niż jedna długa.',
							'Spokojnie i bez straszenia. Nie trzeba mówić o przemocy ani używać trudnych słów: wystarczą słowa „niespodzianka”, „zły sekret”, „smutno”, „dziwnie”.',
							'W domu używajcie słowa „niespodzianka” zamiast „sekret” przy prezentach i miłych rzeczach. Wtedy „sekret” zostaje słowem na rzeczy, o których trzeba powiedzieć.',
							'Razem wybierzcie kilku zaufanych dorosłych, do których dziecko może przyjść: rodzic, babcia, pani w przedszkolu. Dobrze, żeby nie wszyscy byli z najbliższej rodziny.',
							'Szanujcie „nie” dziecka także w rodzinie. Jeśli nie chce całusa od cioci, wystarczy „cześć” albo przybicie piątki. Dziecko uczy się wtedy, że ma prawo do swojego ciała.',
							'Powtarzajcie, że zawsze może Wam o wszystkim powiedzieć i nie będzie za to złości ani kary.'
						]
					}
				]
			},
			{
				heading: 'Gdy dziecko powie o złym sekrecie',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Wysłuchaj spokojnie',
								text: 'Nawet jeśli to, co słyszysz, budzi w Tobie złość albo strach. Dziecko patrzy na Twoją twarz i z niej odczytuje, czy dobrze zrobiło.'
							},
							{
								title: 'Uwierz i podziękuj',
								text: 'Powiedz: „Dobrze, że mi powiedziałeś. To nie jest twoja wina”. Nie wypytuj na siłę i nie dopytuj o szczegóły jak na przesłuchaniu.'
							},
							{
								title: 'Nie obiecuj, że nikomu nie powiesz',
								text: 'Możesz potrzebować pomocy innych dorosłych. Powiedz raczej: „Zrobię wszystko, żebyś był bezpieczny”.'
							},
							{
								title: 'Poproś o radę',
								text: 'Jeśli nie wiesz, co dalej, zadzwoń do specjalistów. Nie musisz mieć pewności, żeby zapytać.'
							}
						]
					},
					{
						kind: 'note',
						text: '800 100 100: bezpłatny i anonimowy telefon dla dorosłych w sprawie bezpieczeństwa dzieci (Fundacja Dajemy Dzieciom Siłę, w dni robocze). 116 111: Telefon Zaufania dla Dzieci i Młodzieży, całodobowy. W sytuacji zagrożenia: 112.'
					}
				]
			},
			{
				heading: 'Zabawa: niespodzianka czy sekret?',
				blocks: [
					{
						kind: 'p',
						text: 'Podawajcie na zmianę krótkie sytuacje, a dziecko mówi, czy to niespodzianka, czy zły sekret. Laurka dla taty na urodziny? Niespodzianka. Kolega zabrał zabawkę i mówi: „Nie mów pani”? Zły sekret, trzeba powiedzieć. Ktoś daje cukierka i mówi: „To będzie nasz sekret”? Zły sekret. Prezent dla babci schowany w szafie? Niespodzianka. Pochwalcie każdą odpowiedź, w której dziecko mówi, komu by powiedziało.'
					},
					{
						kind: 'p',
						text: 'W piosence „Niespodzianka tak, sekret nie” Pikselek robi z mamą laurkę dla taty, a potem ktoś prosi go o sekret, przez który w brzuszku coś ściska. Posłuchajcie jej razem i porozmawiajcie: pytania są niżej.'
					}
				]
			}
		],
		sources: [
			{
				name: 'NSPCC: Zasada bielizny (PANTS), m.in. „mów o sekretach, które cię martwią”',
				url: 'https://www.thefa.com/football-rules-governance/safeguarding/pants---the-nspcc-underwear-rule'
			},
			{
				name: 'Fundacja Dajemy Dzieciom Siłę: telefon 800 100 100 dla dorosłych',
				url: 'https://800100100.pl/'
			},
			{ name: 'Telefon Zaufania dla Dzieci i Młodzieży 116 111', url: 'https://116111.pl/' }
		]
	},
	{
		slug: 'jak-zablokowac-zakupy-w-grach-na-telefonie-dziecka',
		title: 'Jak zablokować zakupy w grach na telefonie dziecka?',
		short: 'Blokada zakupów w grach',
		description:
			'Krok po kroku: blokada zakupów w aplikacjach na Androidzie (Google Play) i iPhonie (Czas przed ekranem) i co zrobić po przypadkowym zakupie dziecka.',
		songId: 'Habi9u9igtI',
		published: '2026-10-24',
		updated: '2026-10-24',
		lead: 'Wiele gier dla dzieci jest „za darmo”, bo zarabia na monetkach, diamentach i skrzynkach kupowanych w grze. Wystarczy kilka stuknięć, żeby z karty rodzica zeszły prawdziwe pieniądze. Na szczęście i Android, i iPhone mają ustawienie, które zatrzymuje zakup, dopóki nie zgodzi się na niego dorosły. To kilka minut pracy, a obok warto porozmawiać z dzieckiem o sztuczkach, którymi gry zachęcają do kupowania.',
		sections: [
			{
				heading: 'Android: hasło przy każdym zakupie w Google Play',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Otwórz aplikację Google Play',
								text: 'Na telefonie lub tablecie, na którym gra dziecko.'
							},
							{
								title: 'Stuknij swoje zdjęcie profilowe',
								text: 'W prawym górnym rogu.'
							},
							{
								title: 'Wybierz „Płatności i subskrypcje”',
								text: 'Potem „Weryfikacja zakupów” i „Wymóg weryfikacji” (na niektórych telefonach: „Częstotliwość weryfikacji”).'
							},
							{
								title: 'Ustaw „Zawsze”',
								text: 'Wtedy każdy zakup przez Google Play, także w grze, wymaga hasła, odcisku palca albo twarzy właściciela konta. Unikaj opcji „Co 30 minut”: przez pół godziny po jednym zakupie kolejne przechodzą bez pytania. Na części urządzeń zamiast częstotliwości wybiera się formę płatności: wtedy wybierz „Wszystkie formy płatności”.'
							}
						]
					},
					{
						kind: 'p',
						text: 'To ustawienie działa na tym jednym urządzeniu i dla zakupów płaconych przez Google Play. Jeśli dziecko ma własne konto Google, prowadzone przez Was w aplikacji Family Link, możecie też włączyć zatwierdzanie zakupów: dziecko wysyła prośbę, a rodzic ją akceptuje albo odrzuca na swoim telefonie.'
					}
				]
			},
			{
				heading: 'iPhone i iPad: blokada w Czasie przed ekranem',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Włącz Czas przed ekranem',
								text: 'W Ustawieniach. Bez niego zakupów nie da się zablokować. Ustaw kod Czasu przed ekranem, którego dziecko nie zna: inny niż kod do odblokowania telefonu.'
							},
							{
								title: 'Wejdź w „Aplikacje i witryny”',
								text: 'Ustawienia → Czas przed ekranem → Aplikacje i witryny.'
							},
							{
								title: 'Wybierz „App Store”',
								text: 'I przy zakupach w aplikacjach ustaw „Zablokowane”. W tym samym miejscu możesz wymagać hasła przy przyszłych zakupach.'
							}
						]
					},
					{
						kind: 'p',
						text: 'Na starszych wersjach systemu te same opcje są w Ustawienia → Czas przed ekranem → Ograniczenia zawartości i prywatności → Zakupy w iTunes i App Store → Zakupy w aplikacjach → Nie zezwalaj. Jeśli dziecko ma własne konto Apple w Chmurze rodzinnej, możecie zamiast blokady włączyć „Poproś o zakup”: każdy zakup czeka wtedy na zgodę rodzica.'
					}
				]
			},
			{
				heading: 'Dwie pułapki',
				blocks: [
					{
						kind: 'list',
						items: [
							'Odcisk palca albo twarz dziecka zapisane w telefonie rodzica. Jeśli zakupy zatwierdza się odciskiem palca, każdy zapisany w telefonie odcisk otworzy też płatność. Zostawcie w telefonie, na którym gra dziecko, tylko odciski i twarz dorosłych.',
							'Hasło znane dziecku. Kod Czasu przed ekranem i hasło do konta Google lub Apple wpisujcie tak, żeby dziecko ich nie widziało, i nie zapisujcie ich na kartce przy telefonie.'
						]
					}
				]
			},
			{
				heading: 'Gdy zakup już się zdarzył',
				blocks: [
					{
						kind: 'list',
						items: [
							'Google Play: zakup zrobiony przez pomyłkę, także przez dziecko, można zgłosić do zwrotu przez pomoc Google Play („Jak poprosić o zwrot środków”). Często najszybciej pomaga napisanie do twórcy gry. Zasady i terminy zwrotów zależą od tego, co i kiedy kupiono, więc nie zwlekajcie.',
							'Apple: zakup zgłasza się na stronie reportaproblem.apple.com, logując się kontem Apple, z którego zapłacono.',
							'Potem od razu włączcie blokadę z tego poradnika i porozmawiajcie z dzieckiem bez krzyku: ono najczęściej nie wiedziało, że to prawdziwe pieniądze.'
						]
					}
				]
			},
			{
				heading: 'Porozmawiajcie o sztuczkach gier',
				blocks: [
					{
						kind: 'p',
						text: 'Blokada zatrzyma zakup, ale nie nauczy dziecka, dlaczego gra tak bardzo chce, żeby kliknęło. Gry celowo kuszą pośpiechem i nagrodami, a dziecku łatwiej się oprzeć, gdy rozpozna te sztuczki. Warto nazwać je razem, przy grze:'
					},
					{
						kind: 'list',
						items: [
							'„Tylko dziś!” i tykający zegar: żeby kliknąć szybko, zanim się pomyśli.',
							'„Wszyscy mają!”: żeby było przykro, że się nie ma.',
							'Monetki i diamenty zamiast złotówek: żeby nie było widać, że to prawdziwe pieniądze.',
							'Skrzynki z niespodzianką: nie wiadomo, co się trafi, więc kusi, żeby spróbować jeszcze raz.'
						]
					},
					{
						kind: 'p',
						text: 'Umówcie się na prostą zasadę: zanim coś kupię w grze, pytam mamę albo tatę. W piosence „Złote monetki” Pikselek gra w grę ze smokiem, a okienka wołają „Kup!”, „Tylko dziś!” i „Wszyscy mają!”. Posłuchajcie jej razem, a potem porozmawiajcie: pytania są niżej.'
					}
				]
			}
		],
		sources: [
			{
				name: 'Pomoc Google Play: wymaganie weryfikacji przy zakupach',
				url: 'https://support.google.com/googleplay/answer/1626831?hl=pl'
			},
			{
				name: 'Pomoc Google Play: zatwierdzanie zakupów (Family Link)',
				url: 'https://support.google.com/googleplay/answer/7039872?hl=pl'
			},
			{
				name: 'Wsparcie Apple: wyłączanie zakupów w aplikacjach w Czasie przed ekranem',
				url: 'https://support.apple.com/pl-pl/102470'
			},
			{
				name: 'Wsparcie Apple: kontrola rodzicielska i „Poproś o zakup”',
				url: 'https://support.apple.com/pl-pl/105121'
			},
			{
				name: 'Pomoc Google Play: zwroty środków',
				url: 'https://support.google.com/googleplay/answer/2479637?hl=pl'
			},
			{ name: 'Apple: zgłaszanie problemu z zakupem', url: 'https://reportaproblem.apple.com/' }
		]
	},
	{
		slug: 'jak-nauczyc-dziecko-dzwonic-pod-112',
		title: 'Jak nauczyć dziecko dzwonić pod numer 112?',
		short: 'Jak dzwonić pod 112',
		description:
			'Kiedy dzwonić pod 112, co powiedzieć i dlaczego się nie rozłączać. Jak przećwiczyć to z przedszkolakiem, z piosenką „Jeden, jeden, dwa” i adresem na pamięć.',
		songId: 'i65ad55Mk14',
		published: '2026-10-24',
		updated: '2026-10-24',
		lead: 'Przedszkolak może być jedyną osobą obok, gdy babci zrobi się słabo albo w domu pojawi się dym. Zadzwonić pod 112 potrafi już trzylatek, trudniejsze jest co innego: wiedzieć, kiedy dzwonić, powiedzieć, co się stało i gdzie, i nie rozłączyć się ze strachu. Tego da się nauczyć zabawą, krok po kroku.',
		sections: [
			{
				heading: 'Kiedy dzwonimy pod 112',
				blocks: [
					{
						kind: 'p',
						text: 'Dziecku najłatwiej zrozumieć to tak: dzwonimy, gdy ktoś potrzebuje pomocy od razu, a obok nie ma dorosłego, który może pomóc. Podajcie przykłady:'
					},
					{
						kind: 'list',
						items: [
							'Ktoś upadł i nie odpowiada albo nie można go obudzić.',
							'W domu jest dym albo ogień.',
							'Ktoś bardzo krwawi albo nie może oddychać.',
							'Ktoś zrobił komuś krzywdę albo grozi.'
						]
					},
					{
						kind: 'p',
						text: 'I przykłady, kiedy nie dzwonimy: zgubiła się zabawka, brat zabrał tablet, nudzi mi się. Wytłumaczcie dlaczego: gdy ktoś dzwoni dla zabawy, w tym samym czasie ktoś inny może czekać na pomoc.'
					}
				]
			},
			{
				heading: 'Co powiedzieć: plan dla dziecka',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Wybierz 1, 1, 2',
								text: 'Na telefonie mamy lub taty, także zablokowanym: na ekranie blokady jest przycisk „Połączenie alarmowe” albo „SOS”. Pokażcie dziecku, gdzie jest na Waszym telefonie.'
							},
							{
								title: 'Powiedz, co się stało',
								text: 'Krótko: „Babcia upadła i nie odpowiada”. Nie trzeba ładnie, wystarczy prawda.'
							},
							{
								title: 'Powiedz, gdzie jesteś',
								text: 'Ulica, numer domu i mieszkania, miasto. To najważniejsza rzecz do nauczenia się na pamięć.'
							},
							{
								title: 'Odpowiadaj na pytania',
								text: 'Osoba w telefonie zada kilka pytań po kolei i powie, co robić. Słuchaj jej.'
							},
							{
								title: 'Nie rozłączaj się',
								text: 'Dopóki ta osoba nie powie, że możesz. A potem nie zajmuj telefonu, bo mogą oddzwonić.'
							}
						]
					},
					{
						kind: 'note',
						text: 'Numer 112 jest bezpłatny i działa w całej Unii Europejskiej. Połączenie odbiera operator numerów alarmowych, który przekazuje zgłoszenie straży pożarnej, policji albo pogotowiu.'
					}
				]
			},
			{
				heading: 'Co dziecko powinno wiedzieć o swoim domu',
				blocks: [
					{
						kind: 'p',
						text: 'Najtrudniejsze w rozmowie z operatorem jest dla dziecka pytanie „gdzie jesteś?”. Dlatego zanim nauczycie dziecko numeru, nauczcie je, gdzie mieszka. Po kolei, nie wszystkiego naraz:'
					},
					{
						kind: 'list',
						items: [
							'Swoje imię i nazwisko, i imiona rodziców. Dla operatora „mama” to za mało.',
							'Nazwę miejscowości, ulicę i numer domu, a w bloku także numer mieszkania i piętro.',
							'Co widać przy domu, jeśli adresu jeszcze nie pamięta: sklep, plac zabaw, szkołę, kolor domu. To też pomaga ratownikom.',
							'Numer telefonu mamy albo taty, gdy dziecko jest już starsze.'
						]
					},
					{
						kind: 'p',
						text: 'Nie musi znać osobnych numerów straży pożarnej, policji i pogotowia: 112 wystarczy na wszystko. Jeśli dziecko zadzwoni przez pomyłkę, niech się nie rozłącza ze strachu, tylko powie, że to była pomyłka. Wytłumaczcie mu to spokojnie, bez krzyku, żeby następnym razem nie bało się zadzwonić, gdy naprawdę będzie trzeba.'
					}
				]
			},
			{
				heading: 'Jak to przećwiczyć',
				blocks: [
					{
						kind: 'list',
						items: [
							'Adres w rymowance albo piosence: łatwiej go zapamiętać, gdy się go śpiewa. Sprawdzajcie co jakiś czas, przy okazji, np. w drodze do domu.',
							'Zabawa w telefon: rodzic jest „panią z telefonu 112”, a dziecko na zabawkowym telefonie mówi, co się stało i gdzie. Zamieniajcie się sytuacjami: dym w kuchni, dziadek nie odpowiada.',
							'Pokażcie na prawdziwym, wyłączonym albo zablokowanym telefonie, gdzie jest przycisk połączenia alarmowego, ale umówcie się, że naprawdę dzwonimy tylko wtedy, gdy ktoś potrzebuje pomocy.',
							'Mówcie spokojnie i rzeczowo. Dziecko nie ma się bać, ma wiedzieć, co zrobić.',
							'Europejski Dzień Numeru Alarmowego 112 przypada 11 lutego. To dobra okazja, żeby wrócić do tematu w domu i w przedszkolu.'
						]
					},
					{
						kind: 'p',
						text: 'W piosence „Jeden, jeden, dwa” Pikselek dzwoni pod 112, gdy babci robi się słabo, a refren dzieci szybko powtarzają: mówię, co się stało i gdzie, i nie rozłączam się. Obejrzyjcie ją razem, a potem przećwiczcie rozmowę. Sam refren jest też w krótkiej wersji.'
					}
				]
			}
		],
		sources: [
			{
				name: 'gov.pl: Numer alarmowy 112, jak zgłaszać',
				url: 'https://www.gov.pl/web/numer-alarmowy-112/jak-zglaszac'
			},
			{ name: 'gov.pl: Numer alarmowy 112', url: 'https://www.gov.pl/web/numer-alarmowy-112' }
		]
	},
	{
		slug: 'bezpieczny-internet-dla-przedszkolaka',
		title: 'Bezpieczny internet dla przedszkolaka – od czego zacząć?',
		short: 'Bezpieczny internet dla przedszkolaka',
		description:
			'Pierwszy tablet i bajki w internecie: zasady dla przedszkolaka, ile czasu przed ekranem, ustawienia i co zrobić, gdy dziecko zobaczy coś strasznego.',
		songId: 'ALro8KR2sZw',
		published: '2026-10-24',
		updated: '2026-10-24',
		lead: 'Przedszkolak często ogląda bajki na tablecie albo telefonie rodzica, zanim nauczy się czytać. Internet daje mu piosenki i gry, ale też reklamy, okienka „Wygrałeś!”, czaty i filmy, które wcale nie są dla dzieci. Nie trzeba od razu wiedzy informatyka: wystarczy kilka prostych zasad dla dziecka, kilka ustawień i umowa, że z każdą dziwną rzeczą przychodzi się do rodzica.',
		sections: [
			{
				heading: 'Zasady dla dziecka',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'W sieci nie podaję, kim jestem',
								text: 'Ani adresu, ani imienia i nazwiska, ani nazwy przedszkola.'
							},
							{
								title: 'Nie każdy jest tym, za kogo się podaje',
								text: 'Nawet słodki kotek na zdjęciu może być kimś zupełnie innym.'
							},
							{ title: 'Nie wysyłam zdjęć nieznajomym', text: 'Ani swoich, ani zdjęć domu.' },
							{
								title: 'Nie klikam w okienka „Wygrałeś!”',
								text: 'To sztuczki, żeby kliknąć. Nic się nie wygrało.'
							},
							{
								title: 'Gdy czegoś nie wiem, pytam',
								text: 'Mamę albo tatę. Także wtedy, gdy zobaczę coś dziwnego albo strasznego.'
							},
							{
								title: 'Po zabawie z tabletem czas na podwórko',
								text: 'Ekran ma swój czas, zabawa też.'
							}
						]
					}
				]
			},
			{
				heading: 'Dla rodzica: pięć prostych kroków',
				blocks: [
					{
						kind: 'list',
						items: [
							'Bądźcie blisko. Przedszkolak korzysta z internetu przy dorosłym, w pokoju, gdzie wszyscy są, a nie sam w swoim pokoju. Najlepiej oglądać i grać razem, przynajmniej na początku.',
							'Pilnujcie czasu. Światowa Organizacja Zdrowia (WHO) zaleca, żeby dzieci w wieku 2–4 lat spędzały przed ekranem najwyżej godzinę dziennie, a mniej znaczy lepiej. Rocznym dzieciom ekranów nie zaleca w ogóle. Czas bez ekranu z dorosłym, czytanie, opowiadanie, śpiewanie i układanki są dla rozwoju bardzo ważne.',
							'Wybierajcie treści sami. Przygotujcie listę bajek i piosenek, które znacie, wyłączcie automatyczne odtwarzanie, po którym filmy lecą jeden za drugim, i nie dawajcie dziecku samodzielnie szukać.',
							'Włączcie ustawienia. Na telefonie z Androidem i na iPhonie są kontrola rodzicielska i blokada zakupów: opisujemy je krok po kroku w poradniku o zakupach w grach.',
							'Umówcie się na zasadę: z każdą dziwną albo straszną rzeczą przychodzę do mamy lub taty i nie dostanę za to kary.'
						]
					}
				]
			},
			{
				heading: 'Pierwsze ustawienia tabletu albo telefonu',
				blocks: [
					{
						kind: 'list',
						items: [
							'Jedna aplikacja na raz. Android ma przypinanie aplikacji (w ustawieniach bezpieczeństwa), a iPhone i iPad Dostęp nadzorowany (w ustawieniach dostępności). Dziecko ogląda wtedy tylko to, co włączyliście, i nie wyjdzie do innych aplikacji bez Waszego kodu.',
							'Osobne konto dziecka. Google (Family Link) i Apple (Chmura rodzinna) pozwalają założyć dziecku konto, na którym rodzic wybiera aplikacje, ustala czas i zatwierdza zakupy.',
							'Bez komunikatorów i poczty. Telefon, który dostaje dziecko, nie powinien mieć otwartego czatu ani skrzynki rodzica, z których można przypadkiem coś wysłać.',
							'Bajki na tej stronie w trybie dla dziecka: duże obrazki piosenek, bez linków i podpowiedzi innych filmów, a wyjście tylko po przytrzymaniu przycisku przez dorosłego.'
						]
					}
				]
			},
			{
				heading: 'Gdy dziecko zobaczy coś strasznego',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Pochwal, że przyszło',
								text: 'To najważniejsze: dziecko zrobiło dokładnie to, czego je uczycie.'
							},
							{
								title: 'Nie zabieraj tabletu za karę',
								text: 'Jeśli powiedzenie kończy się karą, następnym razem dziecko nic nie powie.'
							},
							{
								title: 'Porozmawiajcie spokojnie',
								text: 'Zapytaj, co widziało i jak się z tym czuje. Wytłumacz prostymi słowami.'
							},
							{
								title: 'Zgłoś treść',
								text: 'W serwisie, w którym się pojawiła, a treści szkodliwe i nielegalne, szczególnie zagrażające dzieciom, w Dyżurnet.pl, zespole ekspertów NASK. Nie szukaj takich treści sam.'
							}
						]
					},
					{
						kind: 'note',
						text: 'Rada specjalisty: 800 100 100 to bezpłatny telefon dla dorosłych w sprawie bezpieczeństwa dzieci, także w internecie (Fundacja Dajemy Dzieciom Siłę). Dla dzieci i młodzieży: 116 111.'
					}
				]
			},
			{
				heading: 'Piosenka na początek rozmowy',
				blocks: [
					{
						kind: 'p',
						text: 'W piosence „Klik z głową” Pikselek gra, ogląda bajki i czatuje, ale zna zasady. Posłuchajcie jej razem, a potem porozmawiajcie: pytania są niżej. Dobrze działa też zabawa w „klikam czy pytam?”: pokazujecie dziecku sytuacje (okienko „Wygrałeś!”, ktoś w grze pyta o adres, bajka, którą znamy) i ono mówi, co zrobi.'
					}
				]
			}
		],
		sources: [
			{
				name: 'WHO: zalecenia dotyczące aktywności, ekranów i snu dzieci poniżej 5 lat (2019)',
				url: 'https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more'
			},
			{ name: 'Dyżurnet.pl (NASK): zgłaszanie szkodliwych treści', url: 'https://dyzurnet.pl/' },
			{
				name: 'Fundacja Dajemy Dzieciom Siłę: telefon 800 100 100 dla dorosłych',
				url: 'https://800100100.pl/'
			}
		]
	},
	{
		slug: 'jak-nauczyc-dziecko-czekac-na-swoja-kolej-i-dzielic-sie',
		title: 'Jak nauczyć dziecko czekać na swoją kolej i dzielić się?',
		short: 'Czekanie na swoją kolej i dzielenie się',
		description:
			'Kiedy dziecko uczy się dzielić i czekać na kolej, co pomaga (minutnik, gotowe zdania, pochwała), czego nie robić i jak ćwiczyć to w domu z piosenką.',
		songId: 'H2DUlYqnVVs',
		published: '2026-10-29',
		updated: '2026-10-29',
		lead: 'Huśtawka jest jedna, a chętnych troje. Do tego klocki, ostatnie ciastko i pilot do bajki. Czekanie na swoją kolej i dzielenie się to dla przedszkolaka naprawdę trudna sztuka, której uczy się powoli, przez kilka lat. Dobra wiadomość: można mu w tym bardzo pomóc. Oto co jest normalne w jakim wieku, co działa, a czego lepiej nie robić.',
		sections: [
			{
				heading: 'Czego się spodziewać w jakim wieku',
				blocks: [
					{
						kind: 'p',
						text: 'Dwulatek zwykle bawi się obok innych dzieci, a nie z nimi, i jeszcze nie umie się dzielić. To nie egoizm, tylko etap rozwoju. Żeby oddać zabawkę albo poczekać, trzeba zapanować nad „chcę teraz”, wyobrazić sobie, co czuje ktoś inny, i uwierzyć, że zabawka wróci. Te umiejętności dopiero dojrzewają.'
					},
					{
						kind: 'p',
						text: 'Organizacja ZERO TO THREE pisze, że dzielenie się i czekanie na kolej rozwijają się mniej więcej między 3,5 a 4 rokiem życia. Amerykańska Akademia Pediatrii (AAP) zauważa, że trzylatki potrafią już rozwiązać spór, ustalając kolejkę albo zamieniając się zabawkami, ale na początku potrzebują w tym pomocy dorosłego. Czterolatek coraz częściej pyta „Mogę teraz ja?”, zamiast wyrywać zabawkę. Zmęczenie, gorszy dzień albo ukochana zabawka mogą jednak wszystko zepsuć, i to też jest normalne.'
					},
					{
						kind: 'note',
						text: 'Dziecko, które nie chce się dzielić, nie jest „niegrzeczne”, a rodzic nie zrobił nic źle. Ono uczy się umiejętności, która wymaga czasu, tak jak jazda na rowerze.'
					}
				]
			},
			{
				heading: 'Co pomaga: sześć sposobów',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Pokaż, kiedy czekanie się skończy',
								text: 'Policzcie razem do dziesięciu, nastawcie minutnik albo umówcie się: „jeszcze trzy huśnięcia i zmiana”. Przy minutniku to nie dorosły, tylko on „decyduje”, kiedy zmiana, więc jest mniej kłótni. Dla małego dziecka krótka, za to pewna kolej jest lepsza niż długa i niepewna.'
							},
							{
								title: 'Daj dziecku gotowe słowa',
								text: '„Mogę z tobą?”, „Poproszę, jak skończysz”, „Teraz ja?”. Przećwiczcie te zdania w domu, zanim będą potrzebne na placu zabaw. Amerykańskie CDC radzi uczyć właśnie takiego pytania zamiast brania zabawki z ręki.'
							},
							{
								title: 'Znajdźcie zajęcie na czas czekania',
								text: 'Liczenie, jak Pikselek w piosence, inna zabawka na chwilę, pomaganie dorosłemu. Puste czekanie dłuży się najbardziej.'
							},
							{
								title: 'Nazwij uczucia',
								text: '„Trudno czekać, bardzo chcesz już się huśtać.” Dziecko, które słyszy, że rozumiecie jego złość, szybciej się uspokaja, nawet jeśli kolej i tak przyjdzie dopiero za chwilę.'
							},
							{
								title: 'Chwal od razu i konkretnie',
								text: '„Podzieliłaś się klockami i teraz budujecie razem większą wieżę!” albo „Poczekałeś, aż zjeżdżalnia będzie wolna, brawo!”. Pochwała za konkretne zachowanie mówi dziecku, co dokładnie zrobiło dobrze.'
							},
							{
								title: 'Pokazuj, jak to się robi',
								text: 'Dzielcie się przy dziecku: „Chcesz kawałek mojego jabłka?”, „Dziś ty wybierasz bajkę, jutro ja”. Dzieci uczą się z tego, co widzą, także z tego, jak dorośli spokojnie rozwiązują spory.'
							}
						]
					}
				]
			},
			{
				heading: 'Czego lepiej nie robić',
				blocks: [
					{
						kind: 'list',
						items: [
							'Nie zabierajcie od razu zabawki, którą dziecko właśnie się bawi, żeby „dać koledze”. ZERO TO THREE radzi „długą kolej”: dziecko kończy zabawę, a drugie w tym czasie dostaje coś innego albo czeka z minutnikiem.',
							'Nie zawstydzajcie i nie przyklejajcie etykiet („samolub”, „niedobry”). Dziecko, które często to słyszy, zaczyna w to wierzyć.',
							'Nie tłumaczcie w środku awantury. W złości dziecko nie słyszy pouczeń: najpierw spokój, rozmowa potem.',
							'Nie pozwalajcie na bicie i wyrywanie. Spokojnie, ale od razu: „Nie wyrywamy. Poproś”.',
							'Nie wszystko musi być wspólne. Ukochanego misia albo nowy prezent dziecko może schować przed przyjściem gości. Ustalcie wcześniej, czym się dzielimy, a co jest tylko jego.'
						]
					}
				]
			},
			{
				heading: 'Przećwiczcie to w domu, jak zabawę',
				blocks: [
					{
						kind: 'p',
						text: 'Proste gry na zmianę są świetnym treningiem, bo kolej przychodzi szybko i na pewno: rzucanie piłki do siebie, budowanie wieży z klocków (raz ja, raz ty), układanka, w której każdy dokłada po jednym kawałku, pierwsze gry planszowe. Dobrze działa też teatrzyk z pluszakami: miś chce na huśtawkę, a zajączek już się huśta. Co mogą zrobić? Niech dziecko samo wymyśli rozwiązanie.'
					},
					{
						kind: 'p',
						text: 'W piosence „Raz ja, raz ty” Pikselek czeka na huśtawkę, buduje z kolegą wieżę z klocków i dzieli się z siostrą ciastkiem, a gdy czekać jest bardzo trudno, prosi o pomoc mamę albo tatę. Obejrzyjcie ją razem, a potem porozmawiajcie: pytania są niżej.'
					}
				]
			}
		],
		sources: [
			{
				name: 'ZERO TO THREE: Tuning In, Sharing and Taking Turns',
				url: 'https://www.zerotothree.org/resource/tuning-in-sharing-and-taking-turns/'
			},
			{
				name: 'HealthyChildren.org (AAP): Social Development in Preschoolers',
				url: 'https://www.healthychildren.org/English/ages-stages/preschool/Pages/Social-Development-in-Preschoolers.aspx'
			},
			{
				name: 'CDC: Milestones by 4 Years (wskazówki dla rodziców)',
				url: 'https://www.cdc.gov/act-early/milestones/4-years.html'
			}
		]
	},
	{
		slug: 'czytanie-dziecku-jak-zaczac-20-minut-dziennie',
		title: 'Czytanie dziecku: jak zacząć i czytać 20 minut dziennie?',
		short: 'Czytanie dziecku 20 minut dziennie',
		description:
			'Dlaczego warto czytać dziecku codziennie choć 20 minut, jak wybrać porę i książki, co gdy dziecko nie chce słuchać i jak zacząć z biblioteką.',
		songId: 'qnCfU16epew',
		published: '2026-10-29',
		updated: '2026-10-29',
		lead: 'Wspólne czytanie to jedna z najprostszych rzeczy, które można zrobić dla dziecka: nie wymaga sprzętu ani pieniędzy, tylko książki i kilkunastu minut. Kampania „Cała Polska czyta dzieciom” od lat powtarza: 20 minut dziennie, codziennie. Oto dlaczego to działa i jak zrobić z czytania stały, przyjemny punkt dnia, także wtedy, gdy dziecko się wierci, a rodzic jest zmęczony.',
		sections: [
			{
				heading: 'Dlaczego codziennie i dlaczego razem',
				blocks: [
					{
						kind: 'p',
						text: 'Amerykańska Akademia Pediatrii (AAP) radzi czytać dzieciom od urodzenia, co najmniej do pójścia do szkoły, a najlepiej zrobić z książek część wieczornego rytuału. Wspólne czytanie poszerza słownictwo, bo w książkach jest dużo słów, których nie używamy na co dzień. Ćwiczy uwagę i słuchanie, rozwija wyobraźnię i przygotowuje do samodzielnego czytania. Jest też coś, czego nie widać w żadnym teście: to spokojna chwila bliskości, kiedy rodzic jest tylko dla dziecka.'
					},
					{
						kind: 'p',
						text: 'Fundacja ABCXXI, która prowadzi kampanię „Cała Polska czyta dzieciom”, ujmuje to w jednym zdaniu: czytaj dziecku od urodzenia dla przyjemności, 20 minut dziennie, codziennie. Słowo „przyjemność” jest tu najważniejsze. Czytanie ma być nagrodą i wspólną zabawą, a nie lekcją.'
					},
					{
						kind: 'note',
						text: 'AAP pisze, że najlepsza jest papierowa książka z kolorowymi obrazkami, którą razem przeglądacie. Bajka na ekranie albo audiobook nie dają tej samej rozmowy między dorosłym a dzieckiem.'
					}
				]
			},
			{
				heading: 'Jak zrobić z czytania codzienny zwyczaj',
				blocks: [
					{
						kind: 'steps',
						items: [
							{
								title: 'Wybierzcie stałą porę',
								text: 'Najłatwiej wieczorem, przed snem. Czytanie staje się wtedy częścią rytuału, jak mycie zębów, i nie trzeba o nie walczyć. Może to być też chwila po obiedzie albo sobotni poranek.'
							},
							{
								title: 'Odłóżcie ekrany',
								text: 'Także telefon rodzica. Dziecko szybko wyczuje, że to jest jego czas.'
							},
							{
								title: 'Niech dziecko wybiera',
								text: 'Nawet jeśli po raz dwudziesty tę samą książkę. Powtarzanie jest dla małego dziecka przyjemne i uczy: zna już historię, może ją opowiadać razem z Wami i poprawiać, gdy coś pominiecie.'
							},
							{
								title: 'Czytajcie i rozmawiajcie',
								text: 'Zatrzymujcie się przy obrazkach: „Co tu się dzieje?”, „Jak myślisz, co będzie dalej?”, „Jak się czuje pszczółka?”. Dziecko, które mówi, uczy się więcej niż to, które tylko słucha.'
							},
							{
								title: 'Bawcie się głosem',
								text: 'Inny głos dla każdej postaci, szept, odgłosy zwierząt i maszyn. Nie trzeba umieć grać: dzieci to uwielbiają.'
							},
							{
								title: 'Czytają wszyscy',
								text: 'Babcia, dziadek, starsze rodzeństwo, pani w przedszkolu. 20 minut nie musi być zawsze z tym samym dorosłym ani w jednym kawałku: dwa razy po 10 minut też się liczy.'
							}
						]
					}
				]
			},
			{
				heading: 'Gdy dziecko nie chce słuchać',
				blocks: [
					{
						kind: 'list',
						items: [
							'Wierci się? To normalne. Maluch może słuchać, układając klocki albo leżąc do góry nogami. Nie musi siedzieć grzecznie, żeby słuchać.',
							'Skróćcie czytanie i weźcie inną książkę: krótszą, z większymi obrazkami, o tym, co dziecko teraz kocha, na przykład o koparkach, dinozaurach albo kotach.',
							'Nie róbcie z czytania kary ani warunku („jak nie posłuchasz, nie będzie bajki”) i nie przerywajcie na siłę ulubionej zabawy.',
							'Pokazujcie, że sami czytacie. Dziecko, które widzi dorosłych z książką, uznaje czytanie za coś zwyczajnego i fajnego.',
							'Audiobook albo słuchowisko w samochodzie to dobry dodatek. Porozmawiajcie potem o tym, co było w historii, a czytania razem i tak nie zastąpią.'
						]
					}
				]
			},
			{
				heading: 'Biblioteka i księgarnia',
				blocks: [
					{
						kind: 'p',
						text: 'Zapiszcie dziecko do biblioteki. Usługi bibliotek publicznych są bezpłatne, tak mówi ustawa o bibliotekach, a oddziały dla dzieci mają książki na każdy wiek, często też głośne czytanie i zajęcia dla maluchów. Nowa porcja książek co dwa tygodnie to najprostszy sposób, żeby czytanie się nie znudziło.'
					},
					{
						kind: 'p',
						text: 'Zapytajcie w swojej bibliotece o program Instytutu Książki „Mała książka – wielki człowiek” (edycja 2026/2027). Przedszkolak dostaje w nim wyprawkę czytelniczą i Kartę Małego Czytelnika, na której zbiera naklejki za kolejne wizyty z wypożyczeniem. Nie każda biblioteka bierze w nim udział, więc najlepiej zapytać na miejscu.'
					},
					{
						kind: 'p',
						text: 'W księgarni niech dziecko samo wybierze książkę, nawet jeśli Wam podoba się mniej. Książka wybrana samodzielnie jest „moja” i chętniej się po nią sięga.'
					},
					{
						kind: 'p',
						text: 'W piosence „Czytaj ze mną” Pikselek czyta z mamą o pszczółce, u babci i dziadka słucha o kotku, w przedszkolu wyobraża sobie smoka i rakietę, z tatą odkrywa bibliotekę, a w księgarni sam wybiera książkę. Obejrzyjcie ją razem, a potem porozmawiajcie: pytania są niżej.'
					}
				]
			}
		],
		sources: [
			{
				name: 'Fundacja ABCXXI – Cała Polska czyta dzieciom: Nawyk czytania. Dzieci to kochają',
				url: 'https://calapolskaczytadzieciom.pl/wp-content/uploads/2024/02/Nawyk_czytania_dzieci-to-kochaja.pdf'
			},
			{
				name: 'HealthyChildren.org (AAP): Beyond literacy, shared reading starting in infancy (2024)',
				url: 'https://www.healthychildren.org/English/news/Pages/beyond-literacy-shared-reading-starting-in-infancy-offers-lifelong-benefits.aspx'
			},
			{
				name: 'Ustawa o bibliotekach, art. 14 (ISAP)',
				url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970850539'
			},
			{
				name: 'Instytut Książki: Mała książka – wielki człowiek',
				url: 'https://wielki-czlowiek.pl/'
			}
		]
	}
];

export const guideOf = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidesForSong = (id: string) => GUIDES.filter((g) => g.songId === id);
