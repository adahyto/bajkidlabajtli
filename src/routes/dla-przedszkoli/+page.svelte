<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { thumbOf } from '$lib/cards';
	import { breadcrumbLd } from '$lib/jsonld';
	import { LESSONS, minutesOf } from '$lib/lessons';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';

	/** For teachers: every song's lesson plan and colouring page (lib/lessons.ts) */
	let { data } = $props();
</script>

<Head
	title="Scenariusze zajęć i kolorowanki o bezpieczeństwie dla przedszkoli"
	description="Bezpłatne scenariusze zajęć z piosenkami i kolorowankami z Pikselkiem: zgubienie się w sklepie, złe sekrety, 112, bezpieczny internet, zakupy w grach."
	jsonld={breadcrumbLd(page.url.origin, [
		{ name: SITE.name, path: '/' },
		{ name: 'Dla przedszkoli', path: '/dla-przedszkoli' }
	])}
/>

<section class="intro" aria-labelledby="przedszkola-h">
	<span class="badge">DLA PRZEDSZKOLI I SZKÓŁ</span>
	<h1 id="przedszkola-h">Zajęcia o bezpieczeństwie z Pikselkiem</h1>
	<p class="intro__lead">
		Do każdej piosenki gotowy scenariusz zajęć na około 40 minut: rozmowa, piosenka, zabawa,
		kolorowanka i podsumowanie. Dla przedszkolaków (3–6 lat) i klas 1–3. Wszystko można bezpłatnie
		drukować i wykorzystywać na zajęciach.
	</p>
	<p>
		Dobre okazje: <strong>11 lutego</strong> (Europejski Dzień Numeru Alarmowego 112) i
		<strong>Dzień Bezpiecznego Internetu</strong> w lutym.
	</p>
</section>

<ul class="lessons">
	{#each LESSONS as lesson (lesson.slug)}
		{@const known = data.songs[lesson.songId]}
		<li class="card">
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
				<h2>{lesson.song}</h2>
				<p class="card__topic">{lesson.topic} · około {minutesOf(lesson)} minut</p>
				{#if lesson.day}<p class="card__day">{lesson.day}</p>{/if}
				<div class="card__links">
					<a class="btn btn--blue" href={resolve('/dla-przedszkoli/[slug]', { slug: lesson.slug })}
						>Scenariusz<span class="visually-hidden">: {lesson.song}</span></a
					>
					<a class="btn btn--white" href={resolve('/kolorowanka/[slug]', { slug: lesson.slug })}
						>Kolorowanka<span class="visually-hidden">: {lesson.song}</span></a
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

	.lessons {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
		gap: 22px;
		margin: 0;
		padding: 0;
		list-style: none;
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

	.card__links {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 6px;
	}

	@media (max-width: 600px) {
		.intro {
			padding: 26px 20px;
			border-radius: 28px;
		}
	}
</style>
