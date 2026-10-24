<script lang="ts">
	import type { SongExtra } from '$lib/songs';
	import type { Parents } from '$lib/types';
	import Icon from './Icon.svelte';

	/*
	 * Beside a song, for the grown-ups: the rules of the song and the tips from its description on YouTube
	 * (lib/server/description.ts), the questions and words of lib/songs.ts. Parts that are empty do not show.
	 */
	let { parents, extra }: { parents: Parents; extra: SongExtra } = $props();
</script>

<section class="parents" aria-labelledby="dla-rodzicow">
	<h2 id="dla-rodzicow">Dla rodziców</h2>

	{#if parents.rules.length}
		<div class="parents__rules">
			<h3>Zasady z piosenki</h3>
			<ul>
				{#each parents.rules as rule, i (i)}
					<li><span class="parents__icon" aria-hidden="true">{rule.icon}</span>{rule.text}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if extra.questions?.length}
		<div>
			<h3>Porozmawiajcie po piosence</h3>
			<ol>
				{#each extra.questions as question, i (i)}
					<li>{question}</li>
				{/each}
			</ol>
		</div>
	{/if}

	{#if parents.tips.length}
		<div>
			<h3>Wskazówki</h3>
			{#each parents.tips as tip, i (i)}
				{#if tip.point}
					<p class="parents__point">{tip.text}</p>
				{:else}
					<p>{tip.text}</p>
				{/if}
			{/each}
		</div>
	{/if}

	{#if parents.help.length}
		<div class="parents__help">
			<h3><Icon name="phone" size={20} /> Gdzie szukać pomocy</h3>
			{#if parents.helpIntro}<p>{parents.helpIntro}</p>{/if}
			<ul>
				{#each parents.help as line, i (i)}
					<li>{line.text}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if extra.lyrics}
		<details class="parents__lyrics">
			<summary>Tekst piosenki do wspólnego śpiewania <Icon name="down" size={20} /></summary>
			<p>{extra.lyrics}</p>
		</details>
	{/if}
</section>

<style>
	.parents {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 28px;
		border-radius: 32px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
	}

	.parents h2 {
		font-size: 30px;
	}

	.parents h3 {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
		font-family: 'Nunito', system-ui, sans-serif;
		font-size: 18px;
	}

	.parents p + p {
		margin-top: 8px;
	}

	ul,
	ol {
		margin: 0;
		padding-left: 22px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.parents__rules {
		padding: 18px 20px;
		border-radius: 22px;
		background: var(--sun);
	}

	.parents__rules ul {
		list-style: none;
		padding: 0;
		gap: 8px;
	}

	.parents__rules li {
		display: flex;
		gap: 10px;
		font-weight: 700;
	}

	.parents__icon {
		flex: none;
		width: 1.4em;
		text-align: center;
	}

	.parents__point {
		position: relative;
		padding-left: 22px;
	}

	.parents__point::before {
		content: '';
		position: absolute;
		left: 6px;
		top: 0.65em;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--blue);
	}

	.parents__help {
		padding: 18px 20px;
		border-radius: 22px;
		background: var(--bg);
		box-shadow: inset 0 0 0 2px var(--line);
	}

	.parents__help p {
		margin-bottom: 8px;
	}

	.parents__help li {
		font-weight: 700;
	}

	.parents__lyrics summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 56px;
		padding: 14px 18px;
		border-radius: 18px;
		background: var(--bg);
		box-shadow: inset 0 0 0 2px var(--line);
		font-weight: 800;
		cursor: pointer;
		list-style: none;
	}

	.parents__lyrics p {
		padding: 16px 4px 0;
		white-space: pre-line;
	}
</style>
