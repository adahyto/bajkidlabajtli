<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { pathOf, thumbOf, type Card } from '$lib/cards';
	import { clock } from '$lib/format';
	import { videoLd } from '$lib/jsonld';
	import { SITE } from '$lib/site';
	import type { SongExtra } from '$lib/songs';
	import type { Parents } from '$lib/types';
	import Head from './Head.svelte';
	import Icon from './Icon.svelte';
	import ParentsCard from './ParentsCard.svelte';
	import Player from './Player.svelte';
	import VideoCard from './VideoCard.svelte';

	/** The page of a song (/piosenka) or a short (/krotka): lib/server/song.ts */
	let {
		data
	}: {
		data: {
			video: Card & { fullTitle: string; published: string; intro: string };
			parents: Parents;
			extra: SongExtra;
			full: Card | null;
			short: Card | null;
			playlist: { title: string; slug: string; position: number; count: number } | null;
			prev: Card | null;
			next: Card | null;
			more: Card[];
		};
	} = $props();

	const video = $derived(data.video);
	const hasParents = $derived(
		!!(data.parents.rules.length || data.parents.tips.length || data.extra.questions?.length)
	);
	const description = $derived(
		[video.subtitle || 'Piosenka dla dzieci z Pikselkiem', data.parents.intro || video.intro]
			.filter(Boolean)
			.join('. ')
			.replace(/\.\./g, '.')
			.slice(0, 300)
	);
</script>

<Head
	title={`${video.title} — ${video.short ? 'krótka piosenka' : 'piosenka'} | ${SITE.name}`}
	{description}
	image={thumbOf(video.id, video.short ? 's' : 'l')}
	type="video.other"
	jsonld={videoLd(page.url.origin, video, description, pathOf(video))}
/>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- a part of the resolved home page -->
<a class="back" href={`${resolve('/')}#${video.short ? 'krotkie' : 'piosenki'}`}>
	<Icon name="back" size={20} />
	{video.short ? 'Krótkie piosenki' : 'Wszystkie piosenki'}
</a>

<div class="song" class:song--short={video.short}>
	<div class="song__main">
		<Player
			queue={[{ id: video.id, title: video.title }]}
			next={data.next ? { href: pathOf(data.next), title: data.next.title } : null}
			vertical={video.short}
		/>
		<p class="song__note">
			Film z YouTube włączy się po kliknięciu.
			{#if data.parents.singAlong}Tekst piosenki pojawia się na ekranie, śpiewajcie razem!{/if}
		</p>

		<div class="song__head">
			<div class="song__chips">
				{#if data.extra.topic && !video.short}<span class="chip">{data.extra.topic}</span>{/if}
				{#if video.seconds}<span class="chip chip--plain"
						><span class="visually-hidden">czas: </span>{clock(video.seconds)}</span
					>{/if}
				{#if data.playlist}
					<a
						class="chip chip--plain"
						href={resolve('/playlista/[slug]', { slug: data.playlist.slug })}
						>Playlista: {data.playlist.title} · {data.playlist.position} z {data.playlist.count}</a
					>
				{/if}
			</div>
			<h1>{video.title}</h1>
			{#if video.short && video.intro}
				<p class="song__subtitle">{video.intro}</p>
			{:else if video.subtitle}
				<p class="song__subtitle">{video.subtitle}</p>
			{/if}
		</div>

		{#if data.prev || data.next}
			<nav class="steps" aria-label="Inne piosenki po kolei">
				{#if data.prev}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
					<a class="step" href={pathOf(data.prev)}>
						<Icon name="back" size={28} />
						<img
							src={thumbOf(data.prev.id, video.short ? 's' : 'm')}
							alt=""
							class:step--short={video.short}
							width="112"
							height="63"
							loading="lazy"
						/>
						<span>
							<span class="step__label">Poprzednia</span>
							<span class="step__title">{data.prev.title}</span>
						</span>
					</a>
				{/if}
				{#if data.next}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
					<a class="step step--next" href={pathOf(data.next)}>
						<span>
							<span class="step__label">Następna</span>
							<span class="step__title">{data.next.title}</span>
						</span>
						<img
							src={thumbOf(data.next.id, video.short ? 's' : 'm')}
							alt=""
							class:step--short={video.short}
							width="112"
							height="63"
							loading="lazy"
						/>
						<Icon name="next" size={28} />
					</a>
				{/if}
			</nav>
		{/if}
	</div>

	<aside class="song__side" aria-label="Dla rodziców i inne wersje">
		{#if hasParents}
			<ParentsCard parents={data.parents} extra={data.extra} />
		{/if}
		{#if data.short}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
			<a class="other" href={pathOf(data.short)}>
				<img src={thumbOf(data.short.id, 's')} alt="" width="76" height="135" loading="lazy" />
				<span>
					<span class="other__label">KRÓTKA WERSJA</span>
					<span class="other__title">{data.short.title}</span>
					<span>Sam refren, do śpiewania w kółko</span>
				</span>
			</a>
		{/if}
		{#if data.full}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
			<a class="other other--full" href={pathOf(data.full)}>
				<img src={thumbOf(data.full.id, 'm')} alt="" width="160" height="90" loading="lazy" />
				<span>
					<span class="other__label">CAŁA PIOSENKA</span>
					<span class="other__title">{data.full.title}</span>
				</span>
			</a>
		{/if}
	</aside>
</div>

{#if data.more.length}
	<section aria-labelledby="inne">
		<div class="section-head">
			<h2 id="inne">{video.short ? 'Inne krótkie piosenki' : 'Inne piosenki'}</h2>
		</div>
		<div class="grid" class:grid--shorts={video.short}>
			{#each data.more as card (card.id)}
				<VideoCard {card} />
			{/each}
		</div>
	</section>
{/if}

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

	.song {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 40px;
	}

	.song__main {
		flex: 999 1 600px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.song--short .song__main {
		flex-basis: 420px;
	}

	.song__side {
		flex: 1 1 340px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.song__note {
		margin-top: -6px;
		color: var(--muted);
		font-size: 15px;
	}

	.song__head {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.song__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	a.chip {
		text-decoration: none;
	}

	.song h1 {
		font-size: clamp(38px, 5vw, 58px);
		line-height: 1.04;
	}

	.song__subtitle {
		font-size: 20px;
		max-width: 60ch;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 16px;
	}

	.step {
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 64px;
		padding: 12px 14px;
		border-radius: 24px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
		color: var(--ink);
		text-decoration: none;
	}

	.step:hover {
		color: var(--ink);
	}

	.step > :global(svg) {
		flex: none;
		color: var(--blue);
	}

	.step img {
		flex: none;
		width: 112px;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 14px;
	}

	.step > span {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1 1 auto;
	}

	.step--next {
		background: var(--blue);
		box-shadow: 0 6px 0 var(--blue-edge);
		color: #fff;
		text-align: right;
	}

	.step--next:hover,
	.step--next > :global(svg) {
		color: #fff;
	}

	.step__label {
		font-size: 14px;
		font-weight: 700;
		opacity: 0.85;
	}

	.step__title {
		font-family: var(--display);
		font-weight: 700;
		font-size: 21px;
		line-height: 1.15;
	}

	.step img.step--short {
		width: 44px;
		aspect-ratio: 9 / 16;
		border-radius: 10px;
	}

	@media (max-width: 600px) {
		.step img {
			display: none;
		}
	}

	.other {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px;
		border-radius: 28px;
		background: var(--sky);
		color: var(--ink);
		text-decoration: none;
	}

	.other:hover {
		color: var(--ink);
	}

	.other img {
		flex: none;
		width: 76px;
		aspect-ratio: 9 / 16;
		object-fit: cover;
		border-radius: 16px;
	}

	.other--full img {
		width: 140px;
		aspect-ratio: 16 / 9;
	}

	.other > span {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 15px;
	}

	.other__label {
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.06em;
	}

	.other__title {
		font-family: var(--display);
		font-weight: 700;
		font-size: 24px;
		line-height: 1.1;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 24px;
	}

	.grid--shorts {
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
	}
</style>
