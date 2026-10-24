<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { pathOf, thumbOf } from '$lib/cards';
	import { articleLd, breadcrumbLd } from '$lib/jsonld';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Player from '$lib/components/Player.svelte';

	/*
	 * A guide for parents (lib/guides.ts): the question, a plan for the child and the parent, how to practise it,
	 * the song that teaches it (YouTube only after a click, components/Player.svelte), its questions for a talk and
	 * the sources. Printed: the text without the player.
	 */
	let { data } = $props();
	const guide = $derived(data.guide);
	const date = (iso: string) =>
		new Date(`${iso}T12:00:00Z`).toLocaleDateString('pl-PL', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
</script>

<Head
	title={guide.title}
	description={guide.description}
	type="article"
	image={data.song ? thumbOf(data.song.id, 'l') : undefined}
	jsonld={[
		articleLd(
			page.url.origin,
			guide,
			page.url.pathname,
			data.song ? thumbOf(data.song.id, 'l') : '/udostepnij.png'
		),
		breadcrumbLd(page.url.origin, [
			{ name: SITE.name, path: '/' },
			{ name: 'Poradniki', path: '/poradnik' },
			{ name: guide.short, path: page.url.pathname }
		])
	]}
/>

<article class="guide" aria-labelledby="guide-h">
	<nav class="crumbs no-print" aria-label="Okruszki">
		<a href={resolve('/')}>{SITE.name}</a>
		<span aria-hidden="true">›</span>
		<a href={resolve('/poradnik')}>Poradniki</a>
	</nav>

	<header class="guide__head">
		<span class="badge no-print">PORADNIK DLA RODZICÓW</span>
		<h1 id="guide-h">{guide.title}</h1>
		<p class="guide__lead">{guide.lead}</p>
		<p class="guide__date">
			Opracowanie: {SITE.name} ·
			{#if guide.updated !== guide.published}aktualizacja{:else}publikacja{/if}
			<time datetime={guide.updated}>{date(guide.updated)}</time>
		</p>
	</header>

	{#each guide.sections as section, i (i)}
		<section class="guide__section">
			<h2>{section.heading}</h2>
			{#each section.blocks as block, j (j)}
				{#if block.kind === 'p'}
					<p>{block.text}</p>
				{:else if block.kind === 'steps'}
					<ol class="steps">
						{#each block.items as step, k (k)}
							<li class="step">
								<span class="step__n" aria-hidden="true">{k + 1}</span>
								<span>
									<strong class="step__title">{step.title}.</strong>
									{step.text}
								</span>
							</li>
						{/each}
					</ol>
				{:else if block.kind === 'list'}
					<ul class="list">
						{#each block.items as item, k (k)}
							<li>{item}</li>
						{/each}
					</ul>
				{:else if block.kind === 'note'}
					<p class="note"><Icon name="phone" size={24} /> <span>{block.text}</span></p>
				{/if}
			{/each}
		</section>
	{/each}

	{#if data.song}
		<section class="guide__song" aria-labelledby="song-h">
			<h2 id="song-h">Piosenka: {data.song.title}</h2>
			<div class="no-print">
				<Player queue={[{ id: data.song.id, title: data.song.title }]} />
				<p class="guide__note">Film z YouTube włączy się po kliknięciu.</p>
			</div>
			{#if data.questions.length}
				<h3>Porozmawiajcie po piosence</h3>
				<ol class="questions">
					{#each data.questions as question, k (k)}
						<li>{question}</li>
					{/each}
				</ol>
			{/if}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
			<a class="guide__more no-print" href={pathOf(data.song)}
				>Wszystkie zasady i wskazówki przy piosence „{data.song.title}”</a
			>
		</section>
	{/if}

	<section class="guide__sources" aria-labelledby="sources-h">
		<h2 id="sources-h">Źródła</h2>
		<ul>
			{#each guide.sources as source (source.url)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- another site -->
				<li><a href={source.url} rel="noopener">{source.name}</a></li>
			{/each}
		</ul>
		<p>Poradnik nie zastępuje rady specjalisty. W sytuacji zagrożenia dzwoń pod 112.</p>
	</section>
</article>

<style>
	.guide {
		display: flex;
		flex-direction: column;
		gap: 36px;
		max-width: 820px;
	}

	.crumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 8px;
		margin-block: -8px -24px;
		font-weight: 700;
	}

	/* 44 px to tap, the text where it was */
	.crumbs a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}

	.guide__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	h1 {
		font-size: clamp(36px, 5vw, 56px);
	}

	.guide__lead {
		font-size: 21px;
	}

	.guide__date {
		color: var(--muted);
		font-size: 15px;
		font-weight: 600;
	}

	.guide__section,
	.guide__song,
	.guide__sources {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	h2 {
		font-size: clamp(28px, 3.6vw, 36px);
	}

	h3 {
		font-family: 'Nunito', system-ui, sans-serif;
		font-size: 20px;
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step {
		display: flex;
		gap: 16px;
		padding: 18px 20px;
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

	.step__title {
		font-weight: 800;
	}

	.list,
	.questions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding-left: 24px;
	}

	.questions {
		padding: 18px 20px 18px 44px;
		border-radius: 22px;
		background: var(--sun);
		font-weight: 700;
	}

	.note {
		display: flex;
		gap: 12px;
		padding: 18px 20px;
		border-radius: 22px;
		background: var(--bg);
		box-shadow: inset 0 0 0 3px var(--line);
		font-weight: 700;
	}

	.note :global(svg) {
		flex: none;
		margin-top: 2px;
		color: var(--blue);
	}

	.guide__note {
		margin-top: 10px;
		color: var(--muted);
		font-size: 15px;
	}

	.guide__more {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-weight: 800;
	}

	.guide__sources ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding-left: 22px;
	}

	.guide__sources p {
		color: var(--muted);
		font-size: 16px;
	}

	@media print {
		.guide {
			gap: 16px;
		}

		.step,
		.questions,
		.note {
			padding: 0;
			background: none;
			box-shadow: none;
		}

		.step__n {
			background: none;
			color: #000;
			width: auto;
			height: auto;
		}

		h1 {
			font-size: 28px;
		}

		h2 {
			font-size: 22px;
		}
	}
</style>
