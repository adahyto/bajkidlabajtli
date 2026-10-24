<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import { thumbOf, type Card } from '$lib/cards';
	import { canFullscreen, enterFullscreen, exitFullscreen, isFullscreen } from '$lib/fullscreen';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import HoldButton from '$lib/components/HoldButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Player from '$lib/components/Player.svelte';

	/*
	 * The mode for a child: big pictures of the songs and the shorts, nothing else to click. A picture plays its song
	 * over the whole page, at once, and the end screen asks "Jeszcze raz" or "Następna" (components/Player.svelte);
	 * "Wszystkie po kolei" plays the songs one after another. Nothing leads out of it but the button held for
	 * 3 seconds (components/HoldButton.svelte), for a grown-up. The menu and footer of the site are not here
	 * (routes/+layout.svelte). The icon on a phone's home screen opens this page (static/manifest.webmanifest).
	 */
	let { data } = $props();

	type Stage = { list: Card[]; index: number; vertical: boolean; all: boolean };
	let stage: Stage | null = $state(null);
	let opener: HTMLElement | null = null;
	let back: HTMLButtonElement | undefined = $state();
	let full = $state(false);
	let fullPossible = $state(false);

	$effect(() => {
		fullPossible = canFullscreen();
		const update = () => (full = isFullscreen());
		update();
		document.addEventListener('fullscreenchange', update);
		return () => document.removeEventListener('fullscreenchange', update);
	});

	async function play(list: Card[], index: number, all = false) {
		opener = document.activeElement as HTMLElement | null;
		stage = { list, index, vertical: list[index].short, all };
		await tick();
		back?.focus();
	}

	async function close() {
		stage = null;
		await tick();
		opener?.focus();
	}

	function leave() {
		exitFullscreen();
		goto(resolve('/'));
	}
</script>

<Head
	title={`Tryb dla dziecka | ${SITE.name}`}
	description="Piosenki z Pikselkiem na cały ekran, bez niczego więcej do klikania."
/>
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="kid" inert={!!stage}>
	<div class="kid__bar">
		<p class="kid__name">
			<img src="/pikselek.png" alt="" width="48" height="48" />
			<span class="kid__name-text">{SITE.name}</span>
		</p>
		<div class="kid__grown-ups">
			<!-- In the page from the start, hidden until the browser says it can: the bar does not jump when it shows -->
			<button
				type="button"
				class="kid__full"
				class:kid__full--off={!fullPossible || full}
				onclick={enterFullscreen}
			>
				<Icon name="expand" size={22} /><span class="kid__full-text">Cały ekran</span>
			</button>
			<HoldButton label="Wyjdź" onhold={leave} />
		</div>
	</div>

	{#if data.songs.length}
		<button type="button" class="btn btn--blue kid__all" onclick={() => play(data.songs, 0, true)}>
			<Icon name="play" size={34} /> Wszystkie po kolei
		</button>

		<h1 class="visually-hidden">Piosenki z Pikselkiem</h1>
		<ul class="tiles" aria-label="Piosenki">
			{#each data.songs as card, i (card.id)}
				<li>
					<button type="button" class="tile" onclick={() => play(data.songs, i)}>
						<img src={thumbOf(card.id, 'm')} alt="" width="640" height="360" />
						<span class="tile__title"><span class="visually-hidden">Włącz: </span>{card.title}</span
						>
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="kid__empty">Piosenki właśnie się wczytują. Zajrzyj za chwilę!</p>
	{/if}

	{#if data.shorts.length}
		<h2 class="kid__h2">Krótkie</h2>
		<ul class="tiles tiles--short" aria-label="Krótkie piosenki">
			{#each data.shorts as card, i (card.id)}
				<li>
					<button type="button" class="tile tile--short" onclick={() => play(data.shorts, i)}>
						<img src={thumbOf(card.id, 's')} alt="" width="270" height="480" loading="lazy" />
						<span class="tile__title"><span class="visually-hidden">Włącz: </span>{card.title}</span
						>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

{#if stage}
	<div
		class="stage"
		class:stage--short={stage.vertical}
		role="dialog"
		aria-modal="true"
		aria-label={stage.list[stage.index].title}
	>
		<div class="stage__bar">
			<button type="button" class="stage__back" onclick={close} bind:this={back}>
				<Icon name="back" size={30} /> Piosenki
			</button>
			<p class="stage__title" aria-live="polite">
				{#if stage.all}<span class="visually-hidden">Teraz: </span>{stage.index + 1} z {stage.list
						.length} ·
				{/if}{stage.list[stage.index].title}
			</p>
		</div>
		<div class="stage__player">
			<Player
				queue={stage.list}
				bind:index={stage.index}
				vertical={stage.vertical}
				ask={!stage.all}
				autostart
				closed
			/>
		</div>
	</div>
{/if}

<style>
	:global(body:has(.kid)) {
		background: linear-gradient(180deg, var(--sky), var(--bg) 60%);
	}

	.kid {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.kid__bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.kid__name {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: var(--display);
		font-weight: 800;
		font-size: 24px;
		line-height: 1;
	}

	.kid__name img {
		border-radius: 14px;
	}

	.kid__grown-ups {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.kid__full {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 52px;
		padding: 8px 18px;
		border: 0;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.85);
		color: var(--ink);
		font:
			800 16px/1.2 'Nunito',
			system-ui,
			sans-serif;
		cursor: pointer;
	}

	.kid__full--off {
		visibility: hidden;
	}

	.kid__all {
		align-self: center;
		min-height: 84px;
		padding: 18px 40px;
		border-radius: 28px;
		font-size: clamp(22px, 3vw, 30px);
	}

	.kid__h2 {
		font-size: clamp(28px, 4vw, 38px);
		margin-bottom: -10px;
	}

	.kid__empty {
		font-size: 22px;
		text-align: center;
	}

	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
		gap: 22px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tiles--short {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	.tile {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		height: 100%;
		padding: 12px;
		border: 0;
		border-radius: 30px;
		background: var(--card);
		box-shadow: 0 7px 0 var(--lift);
		color: var(--ink);
		cursor: pointer;
		transition: transform 0.08s;
	}

	.tile:active {
		transform: translateY(4px);
	}

	.tile img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 20px;
	}

	.tile--short img {
		aspect-ratio: 9 / 16;
	}

	.tile__title {
		padding: 0 6px 4px;
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(22px, 2.6vw, 28px);
		line-height: 1.1;
		text-align: left;
	}

	.tile--short .tile__title {
		font-size: 19px;
	}

	/* The song over the whole page: the player as big as the screen allows */
	.stage {
		position: fixed;
		inset: 0;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px 16px 16px;
		background: var(--ink);
		color: #fff;
	}

	.stage__bar {
		display: flex;
		align-items: center;
		gap: 16px;
		min-width: 0;
	}

	.stage__back {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 60px;
		padding: 10px 22px 10px 14px;
		border: 0;
		border-radius: 20px;
		background: var(--sun);
		color: var(--ink);
		font:
			800 20px/1.2 'Nunito',
			system-ui,
			sans-serif;
		cursor: pointer;
		box-shadow: 0 5px 0 var(--sun-edge);
	}

	.stage__title {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(20px, 3vw, 30px);
	}

	.stage__player {
		flex: 1;
		min-height: 0;
		display: grid;
		place-items: center;
	}

	/* The player keeps its shape; whichever of the width and the height runs out first sets its size */
	.stage__player :global(.player) {
		width: min(100%, calc((100dvh - 110px) * 16 / 9));
	}

	.stage--short .stage__player :global(.player) {
		width: auto;
		height: min(100%, calc(100dvh - 110px));
	}

	@media (max-width: 600px) {
		.kid__name {
			font-size: 20px;
		}
	}

	/* The bar stays one row on a phone: Pikselek without the name (still read out), then the icon alone */
	@media (max-width: 520px) {
		.kid__name-text {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	@media (max-width: 400px) {
		.kid__full {
			width: 52px;
			padding: 0;
			justify-content: center;
		}

		.kid__full-text {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	@media (max-width: 600px) {
		.kid__all {
			align-self: stretch;
		}

		.stage {
			padding: 8px 8px 12px;
		}

		.stage__back {
			min-height: 52px;
			font-size: 18px;
		}
	}
</style>
