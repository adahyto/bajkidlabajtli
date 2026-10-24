<script lang="ts">
	import { resolve } from '$app/paths';
	import { pathOf, thumbOf } from '$lib/cards';
	import { clock, songs } from '$lib/format';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Player from '$lib/components/Player.svelte';

	let { data } = $props();

	// The song playing; the player moves it on by itself (components/Player.svelte)
	let index = $state(0);
	const playing = $derived(data.videos[index]);
</script>

<Head
	title={`${data.playlist.title} — playlista | ${SITE.name}`}
	description={`${songs(data.videos.length)} z Pikselkiem, jedna po drugiej: ${data.videos.map((v) => v.title).join(', ')}.`}
	image={data.videos[0] ? thumbOf(data.videos[0].id, 'l') : undefined}
/>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- a part of the resolved home page -->
<a class="back" href={`${resolve('/')}#playlisty`}><Icon name="back" size={20} /> Playlisty</a>

<div class="list">
	<div class="list__main">
		<Player queue={data.videos} bind:index />
		<div class="list__head">
			<span class="badge">PLAYLISTA · TERAZ {index + 1} Z {data.videos.length}</span>
			<h1>{data.playlist.title}</h1>
			{#if playing}<p class="list__now">Teraz: <strong>{playing.title}</strong></p>{/if}
			{#if data.playlist.description}<p class="list__about">{data.playlist.description}</p>{/if}
			<p class="list__note">
				Film z YouTube włączy się po kliknięciu. Piosenki grają jedna po drugiej.
			</p>
		</div>
	</div>

	<ol class="list__songs" aria-label="Piosenki na playliście">
		{#each data.videos as card, i (card.id)}
			<li>
				<button
					type="button"
					class="item"
					aria-current={i === index ? 'true' : undefined}
					onclick={() => (index = i)}
				>
					<img src={thumbOf(card.id, card.short ? 's' : 'm')} alt="" width="160" height="90" />
					<span class="item__text">
						<span class="item__title">{i + 1}. {card.title}</span>
						{#if card.seconds}<span class="item__time">{clock(card.seconds)}</span>{/if}
					</span>
				</button>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
				<a class="item__more" href={pathOf(card)}
					>Dla rodziców<span class="visually-hidden">: {card.title}</span></a
				>
			</li>
		{/each}
	</ol>
</div>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		align-self: flex-start;
		margin-bottom: -40px;
		font-weight: 800;
		text-decoration: none;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 40px;
	}

	.list__main {
		flex: 999 1 600px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.list__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.badge {
		color: #fff;
	}

	h1 {
		font-size: clamp(38px, 5vw, 58px);
	}

	.list__now {
		font-size: 20px;
	}

	.list__about {
		white-space: pre-line;
		max-width: 65ch;
	}

	.list__note {
		color: var(--muted);
		font-size: 15px;
	}

	.list__songs {
		flex: 1 1 340px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list__songs li {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 14px;
		width: 100%;
		padding: 10px;
		border: 0;
		border-radius: 22px;
		background: var(--card);
		box-shadow: 0 5px 0 var(--lift);
		color: var(--ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.item[aria-current='true'] {
		background: var(--sun);
		box-shadow: 0 5px 0 var(--sun-edge);
	}

	.item img {
		flex: none;
		width: 140px;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 14px;
	}

	.item__text {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.item__title {
		font-family: var(--display);
		font-weight: 700;
		font-size: 21px;
		line-height: 1.15;
	}

	.item__time {
		font-size: 14px;
		font-weight: 700;
		color: var(--muted);
	}

	.item__more {
		align-self: flex-end;
		padding: 4px 10px;
		font-size: 15px;
		font-weight: 700;
	}
</style>
