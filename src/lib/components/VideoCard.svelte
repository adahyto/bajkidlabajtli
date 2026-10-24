<script lang="ts">
	import { pathOf, thumbOf, type Card } from '$lib/cards';
	import { clock } from '$lib/format';
	import Icon from './Icon.svelte';

	let { card, eager = false }: { card: Card; eager?: boolean } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
<a class="card" class:card--short={card.short} href={pathOf(card)}>
	<span class="card__picture">
		<img
			src={thumbOf(card.id, card.short ? 's' : 'm')}
			alt=""
			loading={eager ? 'eager' : 'lazy'}
			width={card.short ? 270 : 640}
			height={card.short ? 480 : 360}
		/>
		<span class="card__play"><Icon name="play" size={card.short ? 24 : 26} /></span>
		{#if card.seconds && !card.short}
			<span class="card__time"
				><span class="visually-hidden">czas: </span>{clock(card.seconds)}</span
			>
		{/if}
	</span>
	<span class="card__text">
		<span class="card__title">{card.title}</span>
		{#if card.topic && !card.short}<span class="chip">{card.topic}</span>{/if}
	</span>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px;
		border-radius: var(--radius);
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
		color: var(--ink);
		text-decoration: none;
		transition: transform 0.12s;
	}

	.card:hover {
		color: var(--ink);
		transform: translateY(-3px);
	}

	.card__picture {
		position: relative;
		display: block;
		border-radius: 20px;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		background: var(--line);
	}

	.card--short .card__picture {
		aspect-ratio: 9 / 16;
	}

	.card__picture img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card__play {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 0 5px rgb(255 255 255 / 0.9);
	}

	.card--short .card__play {
		inset: auto 0 14px;
		width: 54px;
		height: 54px;
	}

	.card__time {
		position: absolute;
		right: 10px;
		bottom: 10px;
		background: rgb(31 42 68 / 0.88);
		color: #fff;
		font-weight: 800;
		font-size: 14px;
		padding: 3px 10px;
		border-radius: 10px;
	}

	.card__text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 0 8px 8px;
	}

	.card__title {
		font-family: var(--display);
		font-weight: 700;
		font-size: 23px;
		line-height: 1.15;
	}

	.card--short .card__title {
		font-size: 20px;
	}
</style>
