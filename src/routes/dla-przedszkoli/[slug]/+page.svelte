<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { thumbOf } from '$lib/cards';
	import { dayText } from '$lib/days';
	import { guidesForSong } from '$lib/guides';
	import { breadcrumbLd } from '$lib/jsonld';
	import { minutesOf } from '$lib/lessons';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Player from '$lib/components/Player.svelte';

	/*
	 * A lesson plan for a kindergarten or the first school years (lib/lessons.ts): goals, materials, the steps with
	 * their minutes, the song (YouTube after a click), its rules and questions, the colouring page and the guide for
	 * parents. Printable: the plan without the player.
	 */
	let { data } = $props();
	const lesson = $derived(data.lesson);
	const guides = $derived(guidesForSong(lesson.songId));
	let started = $state(false);
</script>

<Head
	title={`Scenariusz zajęć: ${lesson.song} – ${lesson.topic}`}
	description={lesson.description}
	image={data.song ? thumbOf(data.song.id, data.song.short ? 's' : 'l') : undefined}
	jsonld={breadcrumbLd(page.url.origin, [
		{ name: SITE.name, path: '/' },
		{ name: 'Dla przedszkoli', path: '/dla-przedszkoli' },
		{ name: lesson.song, path: page.url.pathname }
	])}
/>

<article class="lesson" aria-labelledby="lesson-h">
	<nav class="crumbs no-print" aria-label="Okruszki">
		<a href={resolve('/')}>{SITE.name}</a>
		<span aria-hidden="true">›</span>
		<a href={resolve('/dla-przedszkoli')}>Dla przedszkoli</a>
	</nav>

	<header class="lesson__head">
		<span class="badge no-print">SCENARIUSZ ZAJĘĆ</span>
		<h1 id="lesson-h">{lesson.song}: {lesson.topic}</h1>
		<ul class="lesson__facts">
			<li><strong>Wiek:</strong> przedszkole (3–6 lat), klasy 1–3</li>
			<li><strong>Czas:</strong> około {minutesOf(lesson)} minut</li>
			{#if lesson.day}<li><strong>Dobry dzień:</strong> {dayText(lesson.day)}</li>{/if}
		</ul>
		<div class="lesson__buttons no-print">
			<button type="button" class="btn btn--blue" onclick={() => print()}>
				<Icon name="print" /> Drukuj scenariusz
			</button>
			<a class="btn btn--white" href={resolve('/kolorowanka/[slug]', { slug: lesson.slug })}
				>Kolorowanka do druku</a
			>
		</div>
	</header>

	<section class="lesson__section">
		<h2>Cele</h2>
		<ul>
			{#each lesson.goals as goal, i (i)}<li>{goal}</li>{/each}
		</ul>
	</section>

	<section class="lesson__section">
		<h2>Pomoce</h2>
		<ul>
			{#each lesson.materials as item, i (i)}<li>{item}</li>{/each}
		</ul>
	</section>

	<section class="lesson__section">
		<h2>Przebieg</h2>
		<ol class="steps">
			{#each lesson.steps as step, i (i)}
				<li class="step">
					<span class="step__n" aria-hidden="true">{i + 1}</span>
					<span>
						<strong>{step.title}</strong> <span class="step__min">({step.minutes} min)</span>
						<br />{step.text}
					</span>
				</li>
			{/each}
		</ol>
	</section>

	{#if data.rules.length || data.questions.length}
		<section class="lesson__section lesson__rules">
			{#if data.rules.length}
				<div>
					<h2>Zasady z piosenki</h2>
					<ul class="rules">
						{#each data.rules as rule, i (i)}
							<li><span aria-hidden="true">{rule.icon}</span> {rule.text}</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if data.questions.length}
				<div>
					<h2>Pytania do rozmowy</h2>
					<ol>
						{#each data.questions as question, i (i)}<li>{question}</li>{/each}
					</ol>
				</div>
			{/if}
		</section>
	{/if}

	{#if data.song}
		<section class="lesson__section no-print" aria-labelledby="song-h">
			<h2 id="song-h">Piosenka: {data.song.title}</h2>
			<Player
				queue={[{ id: data.song.id, title: data.song.title }]}
				vertical={data.song.short}
				bind:started
			/>
			<p class="lesson__note">
				{#if !started}Film z YouTube włączy się po kliknięciu.{/if} Na zajęciach najlepiej otworzyć tę
				stronę na dużym ekranie.
			</p>
		</section>
	{/if}

	<section class="lesson__section lesson__more">
		<h2>Dla rodziców</h2>
		<p>
			Po zajęciach przekażcie rodzicom kolorowankę i adres
			<strong>bajkidlabajtli.pl/dla-rodzicow</strong>: są tam zasady i pytania do rozmowy w domu.
		</p>
		{#each guides as guide (guide.slug)}
			<p class="no-print">
				<a href={resolve('/poradnik/[slug]', { slug: guide.slug })}>Poradnik: {guide.title}</a>
			</p>
		{/each}
		<p class="lesson__license">
			Scenariusz, kolorowanki i piosenki można bezpłatnie wykorzystywać na zajęciach w przedszkolach
			i szkołach.
		</p>
	</section>
</article>

<style>
	.lesson {
		display: flex;
		flex-direction: column;
		gap: 32px;
		max-width: 860px;
	}

	.crumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 8px;
		margin-block: -8px -22px;
		font-weight: 700;
	}

	/* 44 px to tap, the text where it was */
	.crumbs a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}

	.lesson__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	h1 {
		font-size: clamp(34px, 5vw, 52px);
	}

	h1::first-letter {
		text-transform: uppercase;
	}

	.lesson__facts {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 24px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.lesson__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	.lesson__section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	h2 {
		font-size: clamp(26px, 3.4vw, 34px);
	}

	ul,
	ol {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding-left: 24px;
	}

	.steps {
		gap: 12px;
		padding: 0;
		list-style: none;
	}

	.step {
		display: flex;
		gap: 16px;
		padding: 16px 20px;
		border-radius: 22px;
		background: var(--card);
		box-shadow: 0 5px 0 var(--lift);
	}

	.step__n {
		flex: none;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
		font-family: var(--display);
		font-weight: 800;
		font-size: 22px;
	}

	.step__min {
		color: var(--muted);
		font-weight: 700;
	}

	.lesson__rules {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
		gap: 24px;
	}

	.rules {
		padding: 18px 20px;
		border-radius: 22px;
		background: var(--sun);
		list-style: none;
		font-weight: 700;
	}

	.lesson__note,
	.lesson__license {
		color: var(--muted);
		font-size: 16px;
	}

	@media print {
		.lesson {
			gap: 14px;
		}

		h1 {
			font-size: 28px;
		}

		h2 {
			font-size: 20px;
		}

		.step,
		.rules {
			padding: 0;
			background: none;
			box-shadow: none;
		}

		.step {
			break-inside: avoid;
		}

		.step__n {
			width: auto;
			height: auto;
			background: none;
			color: #000;
		}
	}
</style>
