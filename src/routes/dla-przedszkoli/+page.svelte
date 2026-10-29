<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { thumbOf } from '$lib/cards';
	import { dayText, longDate, nextDate, withDate } from '$lib/days';
	import { breadcrumbLd } from '$lib/jsonld';
	import { LESSONS, minutesOf } from '$lib/lessons';
	import { SITE } from '$lib/site';
	import { SONGS } from '$lib/songs';
	import Head from '$lib/components/Head.svelte';

	/** For teachers: every song's lesson plan and colouring page (lib/lessons.ts) */
	let { data } = $props();

	// In the order of the home page, the newest song first; a song not on the channel (yet) at the end
	const lessons = $derived(
		[...LESSONS].sort(
			(a, b) => (data.songs[a.songId]?.at ?? Infinity) - (data.songs[b.songId]?.at ?? Infinity)
		)
	);
	// Full rows: from 900 px three in a row and the last ones in halves (3 + 2, 3 + 3 + 2, or 3 + 2 + 2 for 7); 640–899 px two
	// in a row and an odd last one across the row, its picture beside the text
	const n = LESSONS.length;
	const half = (i: number) => (n % 3 === 2 && i >= n - 2) || (n % 3 === 1 && n >= 4 && i >= n - 4);
	const across = (i: number) => n % 2 === 1 && i === n - 1;
	const minutes = LESSONS.map(minutesOf);
	const shortest = Math.floor(Math.min(...minutes) / 5) * 5;
	const longest = Math.ceil(Math.max(...minutes) / 5) * 5;
	const saferInternet = nextDate('bezpieczny-internet');
</script>

<Head
	title="Scenariusze zajęć z piosenkami i kolorowanki dla przedszkoli"
	description={withDate(
		'Bezpłatne scenariusze zajęć i kolorowanki do druku: bezpieczeństwo, czytanie, dzielenie się. Też na Dzień Bezpiecznego Internetu ({data}) i Dzień 112.',
		'bezpieczny-internet'
	)}
	jsonld={breadcrumbLd(page.url.origin, [
		{ name: SITE.name, path: '/' },
		{ name: 'Dla przedszkoli', path: '/dla-przedszkoli' }
	])}
/>

<section class="intro" aria-labelledby="przedszkola-h">
	<span class="badge">DLA PRZEDSZKOLI I SZKÓŁ</span>
	<h1 id="przedszkola-h">Zajęcia z Pikselkiem w przedszkolu</h1>
	<p class="intro__lead">
		Do każdej piosenki gotowy scenariusz zajęć: rozmowa, piosenka, zabawa, kolorowanka i
		podsumowanie.
	</p>
	<ul class="facts">
		<li><strong>Dla kogo:</strong> przedszkole (3–6 lat) i klasy 1–3</li>
		<li><strong>Czas:</strong> {shortest}–{longest} minut</li>
		<li>
			<strong>W scenariuszu:</strong> cele, pomoce, przebieg z minutami, zasady z piosenki i pytania do
			rozmowy
		</li>
		<li><strong>Kolorowanka:</strong> Pikselek i zasada z piosenki</li>
		<li><strong>Do druku</strong> na A4 albo do pokazania na dużym ekranie</li>
		<li>
			<strong>Bezpłatnie</strong>, bez rejestracji i logowania; można wykorzystywać na zajęciach
		</li>
	</ul>
	<p>
		Dobre okazje:
		{#if saferInternet}<strong>{longDate(saferInternet)}</strong>{:else}<strong>luty</strong> (co roku
			innego dnia, data na saferinternet.pl){/if} – Dzień Bezpiecznego Internetu,
		<strong>{longDate(nextDate('112')!)}</strong> – Europejski Dzień Numeru Alarmowego 112 i
		<strong>{longDate(nextDate('ksiazka-dla-dzieci')!)}</strong> – Międzynarodowy Dzień Książki dla Dzieci.
	</p>
</section>

<ul class="lessons">
	{#each lessons as lesson, i (lesson.slug)}
		{@const known = data.songs[lesson.songId]}
		<li class="card" class:card--half={half(i)} class:card--across={across(i)}>
			{#if known}
				<img
					src={thumbOf(lesson.songId, known.short ? 's' : 'm')}
					alt=""
					width="320"
					height="180"
					loading="lazy"
				/>
			{/if}
			<div class="card__text">
				{#if SONGS[lesson.songId]?.topic}<span class="chip">{SONGS[lesson.songId].topic}</span>{/if}
				<h2>{lesson.song}</h2>
				<p class="card__topic">{lesson.topic} · około {minutesOf(lesson)} minut</p>
				{#if lesson.day}<p class="card__day">{dayText(lesson.day)}</p>{/if}
				<div class="card__links">
					<a class="btn btn--blue" href={resolve('/dla-przedszkoli/[slug]', { slug: lesson.slug })}
						><span class="btn__name"
							>Scenariusz<span class="visually-hidden">: {lesson.song}</span></span
						><span class="btn__about"><span class="visually-hidden">, </span>do druku · A4</span></a
					>
					<a class="btn btn--white" href={resolve('/kolorowanka/[slug]', { slug: lesson.slug })}
						><span class="btn__name"
							>Kolorowanka<span class="visually-hidden">: {lesson.song}</span></span
						><span class="btn__about"><span class="visually-hidden">, </span>do druku · A4</span></a
					>
				</div>
			</div>
		</li>
	{/each}
</ul>

<p>
	Dla rodziców są <a href={resolve('/dla-rodzicow')}>zasady i pytania do rozmowy</a> oraz
	<a href={resolve('/poradnik')}>poradniki</a>.
</p>

<style>
	.intro {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
		padding: 48px;
		border-radius: 36px;
		background: var(--sun);
	}

	h1 {
		font-size: clamp(38px, 5.5vw, 60px);
		line-height: 1;
	}

	.intro__lead {
		max-width: 760px;
		font-size: 20px;
	}

	/* The cards of a row are as tall as the tallest, so that the buttons stand in one place whatever the title */
	.lessons {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 22px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 640px) and (max-width: 899px) {
		.lessons {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		/* .card below sets a column */
		.card.card--across {
			grid-column: 1 / -1;
			flex-direction: row;
			align-items: center;
		}

		.card.card--across img {
			flex: none;
			width: calc(50% - 25px);
			min-width: 0;
		}

		.card--across .card__text {
			align-self: stretch;
		}
	}

	@media (min-width: 900px) {
		.lessons {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}

		.card {
			grid-column: span 2;
		}

		.card--half {
			grid-column: span 3;
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 14px;
		border-radius: var(--radius);
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
	}

	.card img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 20px;
	}

	.card__text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 0 8px 8px;
	}

	h2 {
		font-size: 28px;
	}

	.card__topic::first-letter {
		text-transform: uppercase;
	}

	.card__topic,
	.card__day {
		color: var(--muted);
		font-weight: 700;
	}

	/* The two buttons side by side, in halves, in every card */
	.card__links {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-top: auto;
		padding-top: 6px;
	}

	.card__links .btn {
		flex-direction: column;
		gap: 0;
		padding: 8px 12px 10px;
	}

	.btn__about {
		font-size: 14px;
		font-weight: 700;
		opacity: 0.85;
	}

	.card .chip {
		align-self: flex-start;
	}

	/* As wide as the box (its items start on the left), two columns where they fit */
	.facts {
		align-self: stretch;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 8px 28px;
		max-width: 1000px;
		margin: 0;
		padding: 0 0 0 22px;
		font-size: 17px;
	}

	@media (max-width: 600px) {
		.intro {
			padding: 26px 20px;
			border-radius: 28px;
		}
	}
</style>
