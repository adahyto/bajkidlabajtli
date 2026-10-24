<script lang="ts">
	import { resolve } from '$app/paths';
	import { pathOf, thumbOf } from '$lib/cards';
	import { clock } from '$lib/format';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import KidModeLink from '$lib/components/KidModeLink.svelte';

	/*
	 * Everything for the grown-ups on one page: the rules of every song and the questions for a talk after it (as on
	 * the song's own page, components/ParentsCard.svelte), the numbers for help once, and how the site keeps the child
	 * away from the rest of YouTube. Printed, it is only the rules and questions (the print styles below and in
	 * app.css).
	 */
	let { data } = $props();
</script>

<Head
	title={`Dla rodziców — zasady z piosenek i pytania do rozmowy | ${SITE.name}`}
	description="Zasady ze wszystkich piosenek z Pikselkiem, pytania do rozmowy z dzieckiem po piosence i wskazówki dla rodziców: bezpieczny internet, zgubienie się w sklepie, zakupy w grach, dobre i złe sekrety."
/>

<section class="intro" aria-labelledby="rodzice-h">
	<span class="badge no-print">DLA RODZICÓW</span>
	<h1 id="rodzice-h">Piosenka, a potem rozmowa</h1>
	<p class="intro__lead">
		Każda piosenka z Pikselkiem uczy kilku prostych zasad: jak bezpiecznie klikać, co zrobić, gdy
		dziecko się zgubi, czym niespodzianka różni się od sekretu. Tutaj są zasady ze wszystkich
		piosenek, pytania do rozmowy z dzieckiem i wskazówki dla dorosłych.
	</p>
	<div class="intro__buttons no-print">
		<button type="button" class="btn btn--blue" onclick={() => print()}>
			<Icon name="print" /> Wydrukuj zasady i pytania
		</button>
		<KidModeLink white />
	</div>
	{#if data.songs.length > 1}
		<nav class="jump no-print" aria-label="Piosenki na tej stronie">
			<ul>
				{#each data.songs as song (song.card.id)}
					<li><a href={`#${song.card.slug}`}>{song.card.title}</a></li>
				{/each}
			</ul>
		</nav>
	{/if}
</section>

<section class="how no-print" aria-labelledby="jak-h">
	<h2 id="jak-h">Jak korzystać z piosenek</h2>
	<ol class="steps">
		<li class="step">
			<span class="step__n" aria-hidden="true">1</span>
			<h3>Obejrzyjcie razem</h3>
			<p>
				Piosenki trwają około dwóch minut, a tekst pojawia się na ekranie, więc łatwo śpiewać razem.
			</p>
		</li>
		<li class="step">
			<span class="step__n" aria-hidden="true">2</span>
			<h3>Porozmawiajcie</h3>
			<p>
				Przy każdej piosence są trzy krótkie pytania. Nie ma złych odpowiedzi: chodzi o to, żeby
				dziecko samo powiedziało zasadę swoimi słowami.
			</p>
		</li>
		<li class="step">
			<span class="step__n" aria-hidden="true">3</span>
			<h3>Przećwiczcie</h3>
			<p>
				Zasada zostaje w głowie, gdy dziecko ją przećwiczy: zabawa w „stój jak drzewo” w domu albo
				nauka numeru telefonu mamy czy taty na pamięć.
			</p>
		</li>
	</ol>
</section>

<div class="songs">
	{#each data.songs as song (song.card.id)}
		<article class="song" id={song.card.slug} aria-labelledby={`${song.card.slug}-h`}>
			<div class="song__head">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
				<a class="song__picture no-print" href={pathOf(song.card)} tabindex="-1" aria-hidden="true">
					<img src={thumbOf(song.card.id, 'm')} alt="" width="320" height="180" loading="lazy" />
					<span class="song__play"><Icon name="play" size={28} /></span>
				</a>
				<div class="song__title">
					<div class="song__chips">
						{#if song.card.topic}<span class="chip">{song.card.topic}</span>{/if}
						{#if song.card.seconds}<span class="chip chip--plain"
								><span class="visually-hidden">czas: </span>{clock(song.card.seconds)}</span
							>{/if}
					</div>
					<h2 id={`${song.card.slug}-h`}>{song.card.title}</h2>
					{#if song.card.subtitle}<p class="song__subtitle">{song.card.subtitle}</p>{/if}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
					<a class="song__open no-print" href={pathOf(song.card)}
						><Icon name="play" size={20} /> Włącz piosenkę<span class="visually-hidden"
							>: {song.card.title}</span
						></a
					>
				</div>
			</div>

			<div class="song__body">
				{#if song.rules.length}
					<div class="rules">
						<h3>Zasady z piosenki</h3>
						<ul>
							{#each song.rules as rule, i (i)}
								<li><span class="rules__icon" aria-hidden="true">{rule.icon}</span>{rule.text}</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if song.questions.length}
					<div class="questions">
						<h3>Porozmawiajcie po piosence</h3>
						<ol>
							{#each song.questions as question, i (i)}
								<li>{question}</li>
							{/each}
						</ol>
					</div>
				{/if}
			</div>

			{#if song.tips.length}
				<div class="tips">
					<h3>Wskazówki dla rodziców</h3>
					{#each song.tips as tip, i (i)}
						<p class:tips__point={tip.point}>{tip.text}</p>
					{/each}
				</div>
			{/if}
		</article>
	{:else}
		<p class="empty">
			Piosenki właśnie się wczytują. Zajrzyj za chwilę albo
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
			<a href={SITE.channel}>obejrzyj je na YouTube</a>.
		</p>
	{/each}
</div>

{#if data.help.length}
	<section class="help" aria-labelledby="pomoc-h">
		<h2 id="pomoc-h"><Icon name="phone" size={28} /> Gdzie szukać pomocy</h2>
		{#if data.helpIntro}<p>{data.helpIntro}</p>{/if}
		<ul>
			{#each data.help as line, i (i)}
				<li><span aria-hidden="true">{line.icon}</span> {line.text}</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="kid-mode no-print" aria-labelledby="dziecko-h">
	<h2 id="dziecko-h">Tryb dla dziecka</h2>
	<div class="kid-mode__body">
		<div class="kid-mode__text">
			<p>
				Same duże obrazki piosenek, bez menu i linków. Dziecko wybiera piosenkę, a po niej widzi
				tylko „Jeszcze raz” i „Następna”. Przycisk „Wszystkie po kolei” włącza piosenki jedna po
				drugiej. Żeby wyjść, przytrzymaj „Wyjdź” przez 3 sekundy. Logo YouTube w odtwarzaczu nadal
				prowadzi do YouTube.
			</p>
			<KidModeLink />
		</div>
		<div class="kid-mode__icon">
			<h3>Ikonka na telefonie albo tablecie</h3>
			<p>Ikonka otwiera od razu tryb dla dziecka, na całym ekranie, bez paska przeglądarki.</p>
			<ul>
				<li>
					<strong>Android (Chrome):</strong> otwórz tryb dla dziecka, w menu ⋮ wybierz „Dodaj do ekranu
					głównego”.
				</li>
				<li>
					<strong>iPhone i iPad (Safari):</strong> otwórz tryb dla dziecka, stuknij „Udostępnij” i wybierz
					„Do ekranu początkowego”.
				</li>
			</ul>
		</div>
	</div>
</section>

<section class="safe no-print" aria-labelledby="strona-h">
	<h2 id="strona-h">Jak strona chroni dziecko</h2>
	<div class="facts">
		<div class="fact">
			<Icon name="shield" size={32} />
			<h3>YouTube dopiero po kliknięciu</h3>
			<p>
				Do tego czasu strona nie łączy się z YouTube. Odtwarzacz działa w trybie rozszerzonej
				prywatności.
			</p>
		</div>
		<div class="fact">
			<Icon name="again" size={32} />
			<h3>Po piosence bez obcych filmów</h3>
			<p>
				Zamiast podpowiedzi YouTube dziecko widzi dwa duże przyciski: „Jeszcze raz” i „Następna”.
			</p>
		</div>
		<div class="fact">
			<Icon name="list" size={32} />
			<h3>Bez ciasteczek i reklam</h3>
			<p>
				Strona nie zapisuje ciasteczek i nie ma reklam ani zewnętrznych statystyk.
				<a href={resolve('/prywatnosc')}>Więcej o prywatności</a>
			</p>
		</div>
	</div>
</section>

<style>
	.intro {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		padding: 48px;
		border-radius: 36px;
		background: var(--sun);
	}

	.intro h1 {
		font-size: clamp(40px, 6vw, 62px);
		line-height: 1;
	}

	.intro__lead {
		max-width: 760px;
		font-size: 20px;
	}

	.intro__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	.jump ul {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.jump a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 8px 16px;
		border-radius: 999px;
		background: #fff;
		color: var(--ink);
		font-weight: 800;
		text-decoration: none;
		box-shadow: 0 4px 0 var(--sun-edge);
	}

	.how h2,
	.help h2,
	.kid-mode h2,
	.safe h2 {
		font-size: clamp(30px, 4vw, 40px);
		margin-bottom: 22px;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
		border-radius: 24px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
	}

	.step__n {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
		font-family: var(--display);
		font-weight: 800;
		font-size: 24px;
	}

	.step h3,
	.fact h3 {
		font-family: 'Nunito', system-ui, sans-serif;
		font-size: 20px;
	}

	.step p,
	.fact p {
		font-size: 17px;
	}

	.songs {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.song {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 36px;
		border-radius: 36px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
		scroll-margin-top: 16px;
	}

	.song__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 20px 28px;
	}

	.song__picture {
		position: relative;
		flex: 0 1 260px;
		display: block;
		border-radius: 22px;
		overflow: hidden;
		box-shadow: 0 5px 0 var(--lift);
	}

	.song__picture img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.song__play {
		position: absolute;
		left: 12px;
		bottom: 12px;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
	}

	.song__title {
		flex: 1 1 300px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	.song__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.song__title h2 {
		font-size: clamp(30px, 4vw, 42px);
	}

	.song__subtitle {
		color: var(--muted);
		font-weight: 600;
	}

	.song__open {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		font-weight: 800;
	}

	.song__body {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}

	.song h3 {
		margin-bottom: 10px;
		font-family: 'Nunito', system-ui, sans-serif;
		font-size: 19px;
	}

	ul,
	ol {
		margin: 0;
		padding-left: 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.rules {
		padding: 20px 22px;
		border-radius: 24px;
		background: var(--sun);
	}

	.rules ul {
		list-style: none;
		padding: 0;
	}

	.rules li {
		display: flex;
		gap: 10px;
		font-weight: 700;
	}

	.rules__icon {
		flex: none;
		width: 1.4em;
		text-align: center;
	}

	.questions {
		padding: 20px 22px;
		border-radius: 24px;
		background: var(--bg);
		box-shadow: inset 0 0 0 2px var(--line);
	}

	.questions li {
		font-weight: 600;
	}

	.tips {
		max-width: 820px;
	}

	.tips p + p {
		margin-top: 8px;
	}

	.tips__point {
		position: relative;
		padding-left: 22px;
	}

	.tips__point::before {
		content: '';
		position: absolute;
		left: 6px;
		top: 0.65em;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--blue);
	}

	.help {
		padding: 36px;
		border-radius: 36px;
		background: var(--card);
		box-shadow: inset 0 0 0 3px var(--line);
	}

	.help h2 {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--ink);
	}

	.help p {
		margin-bottom: 12px;
	}

	.help li {
		font-weight: 700;
		list-style: none;
	}

	.help ul {
		padding: 0;
	}

	.kid-mode__body {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
		gap: 20px;
	}

	.kid-mode__text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
	}

	.kid-mode__icon {
		padding: 24px;
		border-radius: 24px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
	}

	.kid-mode__icon h3 {
		margin-bottom: 8px;
		font-family: 'Nunito', system-ui, sans-serif;
		font-size: 20px;
	}

	.kid-mode__icon ul {
		margin-top: 12px;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 20px;
		color: var(--blue);
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
		border-radius: 24px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
	}

	.fact h3,
	.fact p {
		color: var(--ink);
	}

	.empty {
		font-size: 20px;
	}

	@media (max-width: 600px) {
		.intro,
		.song,
		.help {
			padding: 24px 18px;
			border-radius: 28px;
		}

		.song__picture {
			flex-basis: 100%;
		}
	}

	/* On paper: the rules, questions and tips of every song, black on white, a song not split between pages */
	@media print {
		.intro,
		.song,
		.help {
			padding: 0;
			border-radius: 0;
			background: none;
			box-shadow: none;
		}

		.intro {
			gap: 8px;
		}

		.intro h1 {
			font-size: 30px;
		}

		.intro__lead {
			font-size: 14px;
		}

		.songs {
			gap: 18px;
		}

		.song {
			gap: 10px;
			padding-top: 18px;
			border-top: 2px solid #000;
			break-inside: avoid;
		}

		.song__title h2 {
			font-size: 24px;
		}

		.rules,
		.questions {
			padding: 0;
			background: none;
			box-shadow: none;
		}

		.help h2 {
			font-size: 24px;
			margin-bottom: 10px;
		}

		/* Backgrounds do not print: the dot of a point is a character */
		.tips__point::before {
			content: '•';
			top: 0;
			width: auto;
			height: auto;
			background: none;
		}

		.chip {
			box-shadow: inset 0 0 0 1px #000;
			background: none;
			color: #000;
		}
	}
</style>
