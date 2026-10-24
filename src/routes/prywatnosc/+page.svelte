<script lang="ts">
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';

	// The date of the last change to this page; change it with every change of what the site does with data
	const UPDATED = '2026-10-24';
</script>

<Head
	title={`Prywatność | ${SITE.name}`}
	description="Jakie dane powstają podczas korzystania ze strony Bajki dla Bajtli i co się z nimi dzieje."
/>

<article class="text">
	<h1>Prywatność</h1>
	<p class="lead">
		Strona nie używa ciasteczek, reklam ani zewnętrznych narzędzi analitycznych i o nic nie pyta.
		Filmy są z YouTube, ale strona łączy się z YouTube dopiero wtedy, gdy klikniesz film. Poniżej
		opisuję, jakie dane technicznie powstają i co się z nimi dzieje.
	</p>

	<h2>Kto odpowiada za dane</h2>
	<p>
		Administratorem danych jest {SITE.admin}. W sprawach dotyczących danych możesz pisać na adres
		<a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
	</p>

	<h2>Filmy z YouTube</h2>
	<p>
		Listę filmów, ich opisy i obrazki pobiera z YouTube nasz serwer, a Twoja przeglądarka dostaje je
		od nas. Dopóki nie klikniesz filmu, strona nie łączy się z YouTube ani z innymi serwisami
		Google.
	</p>
	<p>
		Po kliknięciu filmu przeglądarka pobiera odtwarzacz z serwerów YouTube (www.youtube.com i
		www.youtube-nocookie.com, w trybie rozszerzonej prywatności), a odtwarzacz łączy się dalej z
		innymi serwerami Google. YouTube (Google Ireland Limited) widzi wtedy m.in. Twój adres IP i może
		zapisywać dane w przeglądarce, na zasadach opisanych w
		<a href="https://policies.google.com/privacy">polityce prywatności Google</a>. Na to, co YouTube
		robi podczas odtwarzania, nie mam wpływu. Po piosence strona zasłania podpowiedzi YouTube
		własnymi przyciskami.
	</p>

	<h2>Ciasteczka i pamięć przeglądarki</h2>
	<p>
		Strona nie zapisuje ciasteczek. W pamięci karty przeglądarki (sessionStorage) zostaje tylko
		pozycja przewinięcia, żeby po powrocie strona otworzyła się w tym samym miejscu; znika po
		zamknięciu karty.
	</p>
	<p>
		Żeby strona działała jak aplikacja, także bez internetu, przeglądarka zapisuje w swojej pamięci
		(Cache Storage, przez tzw. service worker) kopie plików strony, odwiedzonych stron i obrazków
		piosenek, najwyżej 60 obrazków. To te same treści, które widzi każdy odwiedzający; nie ma w nich
		nic o Tobie i nic z nich nie trafia do nas. Kopie usuwa wyczyszczenie danych tej strony w
		ustawieniach przeglądarki albo odinstalowanie aplikacji. Instalacja aplikacji to zwykła ikonka
		na ekranie: niczego nie wysyła do nas ani do sklepów z aplikacjami.
	</p>

	<h2>Statystyki bez ciasteczek</h2>
	<p>
		Żeby wiedzieć, które piosenki są oglądane, nasz serwer liczy sumy na każdy dzień: ile razy
		otwarto daną stronę i skąd przyszła wizyta, tylko jako rodzaj (wyszukiwarka, asystent AI, serwis
		społecznościowy, inna nasza strona, inna strona, bezpośrednio). O każdej otwartej stronie
		informuje nasz serwer Twoja przeglądarka, podając tylko jej adres, a na pierwszej stronie wizyty
		także nazwę witryny, z której przychodzisz (np. youtube.com, bez reszty jej adresu), i
		oznaczenie utm_source, jeśli link je ma; serwer zamienia to od razu na rodzaj i samej nazwy nie
		zapisuje. Nie zapisuję przy tym adresu IP, ciasteczek, identyfikatorów ani niczego w Twojej
		przeglądarce i nie rozpoznaję tej samej osoby przy kolejnej wizycie; adres IP służy tylko
		chwilowo w pamięci serwera do ograniczenia, żeby jedna osoba nie nabijała liczników. Roboty i
		podglądy linków w komunikatorach nie są liczone. Sumy trzymam 13 miesięcy. Robię to, żeby
		rozwijać stronę (prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).
	</p>

	<h2>Logi serwera</h2>
	<p>
		Serwer pośredniczący (Apache) nie zapisuje logów odwiedzin. Tylko przy błędach technicznych jego
		dziennik błędów może zawierać adres IP i adres strony; jest usuwany po 30 dniach. Jeśli Twoja
		przeglądarka znajdzie na stronie coś niezgodnego z jej zasadami bezpieczeństwa (Content Security
		Policy), wysyła nam zgłoszenie z adresem strony i zablokowanego zasobu; zapisuję je w logach
		technicznych, bez adresu IP. Służy to wyłącznie zapewnieniu działania i bezpieczeństwa strony
		(prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).
	</p>

	<h2>Cloudflare</h2>
	<p>
		Ruch do strony przechodzi przez sieć Cloudflare, która chroni ją przed atakami i przyspiesza
		(prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO). Cloudflare przetwarza przy tym adres
		IP i dane techniczne zapytania na zasadach opisanych w swojej
		<a href="https://www.cloudflare.com/privacypolicy/">polityce prywatności</a>. Firma ma siedzibę
		w USA i przekazuje dane na podstawie unijno-amerykańskich ram ochrony danych (EU-US Data Privacy
		Framework).
	</p>

	<h2>Gdzie są dane i kto je otrzymuje</h2>
	<p>
		Serwer działa w centrum danych OVHcloud we Francji (Unia Europejska), na moje zlecenie. Danych
		nie sprzedaję, nie profiluję nikogo i nie podejmuję wobec nikogo decyzji automatycznie.
	</p>

	<h2>Twoje prawa</h2>
	<p>
		Masz prawo do dostępu do swoich danych, ich sprostowania, usunięcia i ograniczenia przetwarzania
		oraz do wniesienia sprzeciwu. Możesz też złożyć skargę do organu nadzorczego: Prezes Urzędu
		Ochrony Danych Osobowych (uodo.gov.pl).
	</p>

	<p class="updated">Ostatnia zmiana: {UPDATED}</p>
</article>

<style>
	.text {
		max-width: 760px;
		padding: 40px;
		border-radius: 32px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
	}

	h1 {
		font-size: clamp(38px, 5vw, 52px);
		margin-bottom: 16px;
	}

	h2 {
		margin: 32px 0 10px;
		font-size: 26px;
	}

	p + p {
		margin-top: 12px;
	}

	.lead {
		font-size: 20px;
	}

	.updated {
		margin-top: 32px;
		color: var(--muted);
	}

	@media (max-width: 600px) {
		.text {
			padding: 24px 18px;
		}
	}
</style>
