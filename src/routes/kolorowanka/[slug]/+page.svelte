<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { breadcrumbLd } from '$lib/jsonld';
	import { LESSONS } from '$lib/lessons';
	import { withSite } from '$lib/seo';
	import { SITE } from '$lib/site';
	import ColoringPicture from '$lib/components/ColoringPicture.svelte';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';

	/*
	 * A colouring page to print (lib/lessons.ts, components/ColoringPicture.svelte): on screen with a button and the
	 * other pages, on paper one A4 sheet with Pikselek, the song's name and its rule to read aloud.
	 */
	let { data } = $props();
	const lesson = $derived(data.lesson);
</script>

<Head
	title={withSite(`Kolorowanka z Pikselkiem: ${lesson.song} – do druku`)}
	description={`Kolorowanka dla dzieci do wydrukowania: Pikselek z piosenki „${lesson.song}” i zasada do przeczytania. Za darmo, A4.`}
	jsonld={breadcrumbLd(page.url.origin, [
		{ name: SITE.name, path: '/' },
		{ name: 'Dla przedszkoli', path: '/dla-przedszkoli' },
		{ name: `Kolorowanka: ${lesson.song}`, path: page.url.pathname }
	])}
/>

<div class="tools no-print">
	<h1>Kolorowanka: {lesson.song}</h1>
	<p>Wydrukuj na kartce A4. Na dole jest zasada z piosenki do przeczytania dziecku.</p>
	<div class="tools__buttons">
		<button type="button" class="btn btn--blue" onclick={() => print()}>
			<Icon name="print" /> Drukuj kolorowankę
		</button>
		<a class="btn btn--white" href={resolve('/dla-przedszkoli/[slug]', { slug: lesson.slug })}
			>Scenariusz zajęć</a
		>
	</div>
</div>

<article class="sheet" aria-label={`Kolorowanka: ${lesson.song}`}>
	<p class="sheet__title">{lesson.song}</p>
	<ColoringPicture
		scene={lesson.coloring.scene}
		label={`Pikselek do pokolorowania: ${lesson.song}`}
	/>
	<p class="sheet__rule">{lesson.coloring.caption}</p>
	<p class="sheet__site">{SITE.name} · bajkidlabajtli.pl</p>
</article>

<nav class="others no-print" aria-label="Inne kolorowanki">
	<h2>Inne kolorowanki</h2>
	<ul>
		{#each LESSONS.filter((l) => l.slug !== lesson.slug) as other (other.slug)}
			<li>
				<a href={resolve('/kolorowanka/[slug]', { slug: other.slug })}>{other.song}</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.tools {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	h1 {
		font-size: clamp(34px, 5vw, 50px);
	}

	.tools__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	/* The sheet as it prints: A4 proportions on screen too */
	.sheet {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(100%, 720px);
		aspect-ratio: 210 / 297;
		margin-top: -32px;
		padding: 36px 40px;
		border-radius: 12px;
		background: #fff;
		color: #111;
		box-shadow: 0 6px 0 var(--lift);
	}

	.sheet :global(.coloring) {
		flex: 1;
		min-height: 0;
		width: 100%;
	}

	.sheet__title {
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(30px, 5vw, 46px);
		line-height: 1;
		text-align: center;
	}

	.sheet__rule {
		font-family: var(--display);
		font-weight: 700;
		font-size: clamp(20px, 3vw, 28px);
		line-height: 1.2;
		text-align: center;
	}

	.sheet__site {
		font-size: 13px;
	}

	.others ul {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 22px;
		margin: 12px 0 0;
		padding: 0;
		list-style: none;
		font-weight: 800;
	}

	.others h2 {
		font-size: 28px;
	}

	@media print {
		@page {
			size: A4 portrait;
			margin: 10mm;
		}

		.sheet {
			width: 100%;
			height: 270mm;
			aspect-ratio: auto;
			margin: 0;
			padding: 0;
			box-shadow: none;
		}

		.sheet__title {
			font-size: 40px;
		}

		.sheet__rule {
			font-size: 24px;
		}
	}
</style>
