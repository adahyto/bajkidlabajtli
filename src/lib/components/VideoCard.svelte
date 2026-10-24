<script lang="ts">
	import { pathOf, thumbOf, type Card } from '$lib/cards';
	import { clock } from '$lib/format';
	import type { Width } from '$lib/grid';
	import Icon from './Icon.svelte';

	/*
	 * wide: the screen widths at which the card takes two columns of the grid, with its picture beside the text, so
	 * that no row of the grid stays half empty (lib/grid.ts chooses them): md 640–899 px, lg 900–1099 px, xl
	 * from 1100 px
	 */
	let {
		card,
		eager = false,
		wide = []
	}: { card: Card; eager?: boolean; wide?: Width[] } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
<a
	class="card"
	class:card--short={card.short}
	class:card--wide-md={wide.includes('md')}
	class:card--wide-lg={wide.includes('lg')}
	class:card--wide-xl={wide.includes('xl')}
	href={pathOf(card)}
>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
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
		{#if wide.length && card.subtitle}<span class="card__subtitle">{card.subtitle}</span>{/if}
		{#if card.short && card.from}<span class="card__from">z piosenki: {card.from}</span>{/if}
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

	/* Cards in a row are as tall as the tallest; the topic stays in one place under a title of one or two lines */
	.card__text {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 0 8px 8px;
	}

	.card__title {
		min-height: calc(2em * 1.15);
		font-family: var(--display);
		font-weight: 700;
		font-size: 23px;
		line-height: 1.15;
	}

	.card--short .card__title {
		min-height: 0;
		font-size: 20px;
	}

	.card__from {
		margin-top: -6px;
		color: var(--muted);
		font-weight: 700;
		font-size: 15px;
		line-height: 1.3;
	}

	/* Only on a wide card, beside the picture: what the song is about */
	.card__subtitle {
		display: none;
		color: var(--muted);
		font-weight: 600;
		font-size: 17px;
		line-height: 1.4;
	}

	/* A wide card: two columns, a bigger picture with the text beside it, both in the middle of the row */
	@media (min-width: 640px) and (max-width: 899px) {
		.card--wide-md {
			grid-column: span 2;
			flex-direction: row;
			align-items: center;
			gap: 20px;
		}

		.card--wide-md .card__picture {
			flex: 0 0 58%;
		}

		.card--wide-md .card__text {
			flex: 1;
			justify-content: center;
			padding: 8px 8px 8px 0;
		}

		.card--wide-md .card__title {
			min-height: 0;
			font-size: 28px;
		}

		.card--wide-md .card__subtitle {
			display: block;
		}
	}

	@media (min-width: 900px) and (max-width: 1099px) {
		.card--wide-lg {
			grid-column: span 2;
			flex-direction: row;
			align-items: center;
			gap: 20px;
		}

		.card--wide-lg .card__picture {
			flex: 0 0 58%;
		}

		.card--wide-lg .card__text {
			flex: 1;
			justify-content: center;
			padding: 8px 8px 8px 0;
		}

		.card--wide-lg .card__title {
			min-height: 0;
			font-size: 28px;
		}

		.card--wide-lg .card__subtitle {
			display: block;
		}
	}

	@media (min-width: 1100px) {
		.card--wide-xl {
			grid-column: span 2;
			flex-direction: row;
			align-items: center;
			gap: 20px;
		}

		.card--wide-xl .card__picture {
			flex: 0 0 58%;
		}

		.card--wide-xl .card__text {
			flex: 1;
			justify-content: center;
			padding: 8px 8px 8px 0;
		}

		.card--wide-xl .card__title {
			min-height: 0;
			font-size: 28px;
		}

		.card--wide-xl .card__subtitle {
			display: block;
		}
	}
</style>
