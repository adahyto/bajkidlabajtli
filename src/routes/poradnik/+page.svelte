<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { GUIDES } from '$lib/guides';
	import { breadcrumbLd } from '$lib/jsonld';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';

	/** The guides for parents (lib/guides.ts), newest first */
	const guides = [...GUIDES].sort((a, b) => b.published.localeCompare(a.published));
</script>

<Head
	title="Poradniki dla rodziców dzieci 3–8 lat | Bajki dla Bajtli"
	description="Krótkie poradniki dla rodziców dzieci 3–8 lat: co zrobić, gdy dziecko zgubi się w sklepie, jak czytać razem, jak uczyć czekania na swoją kolej i więcej."
	jsonld={breadcrumbLd(page.url.origin, [
		{ name: SITE.name, path: '/' },
		{ name: 'Poradniki', path: '/poradnik' }
	])}
/>

<section class="guides" aria-labelledby="poradniki-h">
	<h1 id="poradniki-h">Poradniki dla rodziców</h1>
	<p class="guides__lead">
		Jedna sytuacja, jeden plan: co ma zrobić dziecko, co rodzic i jak przećwiczyć to razem, z
		piosenką, która pomaga zapamiętać zasady.
	</p>
	<ul>
		{#each guides as guide (guide.slug)}
			<li>
				<a class="guide" href={resolve('/poradnik/[slug]', { slug: guide.slug })}>
					<span class="guide__title">{guide.title}</span>
					<span>{guide.description}</span>
				</a>
			</li>
		{/each}
	</ul>
	<p>
		Zasady i pytania ze wszystkich piosenek są też na stronie <a href={resolve('/dla-rodzicow')}
			>Dla rodziców</a
		>.
	</p>
</section>

<style>
	.guides {
		display: flex;
		flex-direction: column;
		gap: 22px;
		max-width: 820px;
	}

	h1 {
		font-size: clamp(38px, 5vw, 56px);
	}

	.guides__lead {
		font-size: 20px;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.guide {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 24px 28px;
		border-radius: 28px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
		color: var(--ink);
		text-decoration: none;
	}

	.guide:hover {
		color: var(--ink);
		box-shadow:
			inset 0 0 0 3px var(--sun),
			0 6px 0 var(--lift);
	}

	.guide__title {
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(24px, 3vw, 30px);
		line-height: 1.1;
		color: var(--blue-edge);
	}
</style>
