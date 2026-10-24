<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { pathOf, thumbOf } from '$lib/cards';
	import { clock, songs } from '$lib/format';
	import { enterFullscreen } from '$lib/fullscreen';
	import { siteLd } from '$lib/jsonld';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import VideoCard from '$lib/components/VideoCard.svelte';
	import { songGrid } from '$lib/grid';

	let { data } = $props();

	// The grid of songs without a half-empty last row (lib/grid.ts)
	const grid = $derived(songGrid(data.songs.length));
</script>

<Head
	title={`${SITE.name} – piosenki dla dzieci o bezpieczeństwie z Pikselkiem`}
	jsonld={siteLd(page.url.origin)}
/>

{#if data.hero}
	<section class="hero" aria-labelledby="hero-h">
		<div class="hero__text">
			<h1 id="hero-h">
				Śpiewaj z Pikselkiem! <span class="hero__about">Piosenki dla dzieci o bezpieczeństwie</span>
			</h1>
			<p>
				Krótkie piosenki dla dzieci 3–8 lat. W każdej jedna prosta zasada, zaśpiewana tak, żeby
				została w głowie.
			</p>
		</div>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
		<a class="hero__video" href={pathOf(data.hero)}>
			<img
				src={thumbOf(data.hero.id, data.hero.short ? 's' : 'l')}
				alt=""
				width="1280"
				height="720"
				fetchpriority="high"
			/>
			<span class="hero__play"><Icon name="play" size={44} /></span>
			<span class="hero__title"
				><span class="visually-hidden">Włącz: </span><span class="hero__new"
					>{data.heroNew ? 'Nowa' : 'Najnowsza'}<span class="visually-hidden">
						piosenka:</span
					></span
				>
				{data.hero.title}</span
			>
			{#if data.hero.seconds}<span class="hero__time">{clock(data.hero.seconds)}</span>{/if}
		</a>
		<!-- Three ways in, one for each who comes: a child with a parent, a parent, a teacher -->
		<ul class="paths" aria-label="Dla kogo">
			<li>
				<a class="path path--kid" href={resolve('/dziecko')} onclick={enterFullscreen}>
					<span class="path__icon"><Icon name="play" size={26} /></span>
					<span class="path__text">
						<span class="path__name">Włącz dziecku</span>
						<span class="path__about">Same piosenki, bez menu i linków</span>
					</span>
				</a>
			</li>
			<li>
				<a class="path" href={resolve('/dla-rodzicow')}>
					<span class="path__icon"><Icon name="heart" size={26} /></span>
					<span class="path__text">
						<span class="path__name">Dla rodziców</span>
						<span class="path__about">Zasady i pytania do rozmowy</span>
					</span>
				</a>
			</li>
			<li>
				<a class="path" href={resolve('/dla-przedszkoli')}>
					<span class="path__icon"><Icon name="book" size={26} /></span>
					<span class="path__text">
						<span class="path__name">Dla przedszkoli</span>
						<span class="path__about">Scenariusze zajęć i kolorowanki</span>
					</span>
				</a>
			</li>
		</ul>
	</section>

	<ul class="trust" aria-label="Jak strona chroni dziecko">
		<li>
			<Icon name="shield" size={28} />
			<p>
				<strong>YouTube dopiero po kliknięciu.</strong> Do tego czasu strona nie łączy się z
				YouTube.
				<a href={resolve('/prywatnosc')}>Więcej o prywatności</a>
			</p>
		</li>
		<li>
			<Icon name="again" size={28} />
			<p>
				<strong>Po piosence bez obcych filmów.</strong> Zamiast podpowiedzi YouTube tylko „Jeszcze raz”
				i „Następna”.
			</p>
		</li>
	</ul>
{:else}
	<section class="hero">
		<div class="hero__text">
			<h1>Śpiewaj z Pikselkiem!</h1>
			<p>Piosenki właśnie się wczytują. Zajrzyj za chwilę albo obejrzyj je na YouTube.</p>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
			<a class="btn btn--blue" href={SITE.channel}>Kanał na YouTube</a>
		</div>
	</section>
{/if}

{#if data.songs.length}
	<section id="piosenki" aria-labelledby="piosenki-h">
		<div class="section-head">
			<h2 id="piosenki-h">Piosenki</h2>
			<p>Od najnowszej. Nowa co tydzień.</p>
		</div>
		<div class="grid" style:--xl-cols={grid.xlCols}>
			{#each data.songs as card, i (card.id)}
				<VideoCard {card} eager={i < 4} wide={grid.wide[i]} />
			{/each}
		</div>
	</section>
{/if}

{#if data.shorts.length}
	<section id="krotkie" aria-labelledby="krotkie-h">
		<div class="section-head">
			<h2 id="krotkie-h">Krótkie piosenki</h2>
			<p>Same refreny, do śpiewania razem</p>
		</div>
		<ul class="shorts" aria-label="Krótkie piosenki">
			{#each data.shorts as card (card.id)}
				<li><VideoCard {card} /></li>
			{/each}
		</ul>
	</section>
{/if}

{#if data.playlists.length}
	<section id="playlisty" aria-labelledby="playlisty-h">
		<div class="section-head">
			<h2 id="playlisty-h">Playlisty</h2>
		</div>
		<div class="playlists">
			{#each data.playlists as list (list.slug)}
				<article class="playlist">
					<a
						class="playlist__pictures"
						href={resolve('/playlista/[slug]', { slug: list.slug })}
						aria-hidden="true"
						tabindex="-1"
					>
						{#each list.pictures as id (id)}
							<img src={thumbOf(id, 'm')} alt="" loading="lazy" width="640" height="360" />
						{/each}
					</a>
					<div class="playlist__text">
						<span class="badge badge--dark">PLAYLISTA · {songs(list.count).toUpperCase()}</span>
						<h3>{list.title}</h3>
						{#if list.summary}<p>{list.summary}</p>{/if}
						<a class="btn btn--blue" href={resolve('/playlista/[slug]', { slug: list.slug })}>
							<Icon name="play" /> Wszystkie po kolei
						</a>
					</div>
				</article>
			{/each}
		</div>
	</section>
{/if}

<section id="rodzice" class="parents" aria-labelledby="rodzice-h">
	<div class="parents__intro">
		<h2 id="rodzice-h">Dla rodziców</h2>
		<p>
			Po piosence łatwo zacząć rozmowę o trudnym temacie bez trudnych słów. Piosenki są autorskie,
			bez krzyku i bez reklam zabawek.
		</p>
	</div>
	<ol class="steps">
		<li>
			<span class="steps__n" aria-hidden="true">1</span>
			<h3>Obejrzyjcie</h3>
			<p>Piosenka trwa około dwóch minut, a tekst jest na ekranie.</p>
		</li>
		<li>
			<span class="steps__n" aria-hidden="true">2</span>
			<h3>Porozmawiajcie</h3>
			<p>Przy każdej piosence są trzy krótkie pytania do dziecka.</p>
		</li>
		<li>
			<span class="steps__n" aria-hidden="true">3</span>
			<h3>Przećwiczcie</h3>
			<p>Zabawa w „stój jak drzewo” albo numer mamy na pamięć.</p>
		</li>
	</ol>
	<a class="btn btn--blue" href={resolve('/dla-rodzicow')}>Zasady i pytania do rozmowy</a>
</section>

<style>
	.hero {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 40px;
		padding: 48px;
		border-radius: 36px;
		background: var(--sun);
	}

	.hero__text {
		flex: 1 1 340px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}

	.hero h1 {
		font-size: clamp(44px, 6vw, 66px);
		line-height: 1;
	}

	/* What the site is, for search engines too, under the call */
	.hero__about {
		display: block;
		margin-top: 12px;
		font-size: clamp(22px, 2.6vw, 28px);
		line-height: 1.15;
	}

	.hero__text p {
		font-size: 20px;
		max-width: 32ch;
	}

	.hero__video {
		flex: 1 1 440px;
		position: relative;
		display: block;
		aspect-ratio: 16 / 9;
		border-radius: 28px;
		overflow: hidden;
		background: var(--ink);
		box-shadow: 0 10px 0 rgb(31 42 68 / 0.18);
	}

	.hero__video img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero__play {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 104px;
		height: 104px;
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 0 8px rgb(255 255 255 / 0.9);
		transition: transform 0.12s;
	}

	.hero__video:hover .hero__play {
		transform: scale(1.06);
	}

	.hero__title,
	.hero__time {
		position: absolute;
		bottom: 16px;
		font-weight: 800;
		border-radius: 14px;
		padding: 8px 14px;
	}

	.hero__title {
		left: 16px;
		max-width: calc(100% - 110px);
		background: #fff;
		color: var(--ink);
		font-size: 17px;
		line-height: 1.25;
	}

	.hero__new {
		display: inline-block;
		margin-right: 4px;
		padding: 1px 8px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--sun);
		font-size: 13px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		vertical-align: 2px;
	}

	/* Three equal ways in under the text and the video, in a row; on a phone one under another */
	.paths {
		flex-basis: 100%;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.path {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 76px;
		padding: 14px 18px;
		border-radius: 22px;
		background: #fff;
		color: var(--ink);
		text-decoration: none;
		box-shadow: 0 6px 0 var(--sun-edge);
		transition: transform 0.08s;
	}

	.path:hover {
		color: var(--ink);
	}

	.path:active {
		transform: translateY(3px);
	}

	.path__icon {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--chip);
		color: var(--blue);
	}

	.path__text {
		display: flex;
		flex-direction: column;
	}

	.path__name {
		font-weight: 800;
		font-size: 20px;
		line-height: 1.2;
	}

	.path__about {
		color: var(--muted);
		font-weight: 600;
		font-size: 15px;
		line-height: 1.3;
	}

	.path--kid {
		background: var(--blue);
		color: #fff;
		box-shadow: 0 6px 0 var(--blue-edge);
	}

	.path--kid:hover {
		color: #fff;
	}

	.path--kid .path__icon {
		background: #fff;
	}

	.path--kid .path__about {
		color: #e3eeff;
	}

	@media (max-width: 899px) {
		.paths {
			grid-template-columns: minmax(0, 1fr);
			gap: 14px;
		}
	}

	/* How the site keeps the child away from the rest of YouTube, right under the first view */
	.trust {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
		gap: 12px 28px;
		margin: -40px 0 0;
		padding: 0 8px;
		list-style: none;
		color: var(--blue);
	}

	.trust li {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.trust :global(svg) {
		flex: none;
		margin-top: 2px;
	}

	.trust p {
		color: var(--ink);
		font-size: 17px;
	}

	@media (max-width: 600px) {
		.trust {
			margin-top: -24px;
			padding: 0;
		}
	}

	.hero__time {
		right: 16px;
		background: rgb(31 42 68 / 0.88);
		color: #fff;
		font-size: 15px;
	}

	@media (max-width: 600px) {
		.hero {
			padding: 16px 16px 24px;
			gap: 20px;
			border-radius: 28px;
		}

		.hero__video {
			order: -1;
			flex-basis: 100%;
			border-radius: 20px;
		}

		.hero__play {
			width: 76px;
			height: 76px;
		}

		.hero__title,
		.hero__time {
			bottom: 10px;
			padding: 5px 10px;
			border-radius: 12px;
		}

		.hero__title {
			left: 10px;
			max-width: calc(100% - 84px);
			font-size: 15px;
		}

		.hero__time {
			right: 10px;
			font-size: 14px;
		}

		.hero__new {
			font-size: 12px;
		}
	}

	/* 1 column on a phone, 2, 3 and then 3 or 4 (--xl-cols); the wide cards in lib/grid.ts */
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 24px;
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1100px) {
		.grid {
			grid-template-columns: repeat(var(--xl-cols), minmax(0, 1fr));
		}
	}

	/* The shorts in one row that moves sideways: five fit on a computer, more move in */
	.shorts {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 160px;
		gap: 12px;
		margin: -8px -16px 0;
		padding: 8px 16px 16px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 16px;
		list-style: none;
	}

	.shorts li {
		display: flex;
		scroll-snap-align: start;
	}

	.shorts li > :global(*) {
		flex: 1;
	}

	@media (min-width: 640px) {
		.shorts {
			grid-auto-columns: calc((100% - 32px - 3 * 20px) / 3.4);
			gap: 20px;
		}
	}

	@media (min-width: 1100px) {
		.shorts {
			margin-inline: -8px;
			padding-inline: 8px;
			scroll-padding-inline: 8px;
			grid-auto-columns: calc((100% - 16px - 4 * 20px) / 5);
		}
	}

	.playlists {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.playlist {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 36px;
		padding: 32px;
		border-radius: 36px;
		background: var(--sky);
	}

	.playlist__pictures {
		flex: 1 1 400px;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.playlist__pictures img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 10px;
	}

	.playlist__pictures img:first-child {
		border-top-left-radius: 22px;
	}

	.playlist__pictures img:nth-child(2) {
		border-top-right-radius: 22px;
	}

	.playlist__text {
		flex: 1 1 320px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	.badge--dark {
		color: #fff;
	}

	.playlist h3 {
		font-size: clamp(32px, 4vw, 44px);
	}

	@media (max-width: 600px) {
		.playlist {
			padding: 16px 16px 24px;
			gap: 18px;
			border-radius: 28px;
		}

		.playlist .btn {
			width: 100%;
		}
	}

	.parents {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 48px;
		border-radius: 36px;
		background: var(--card);
		box-shadow: 0 6px 0 var(--lift);
		scroll-margin-top: 16px;
	}

	.parents__intro {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 760px;
	}

	.parents__intro h2 {
		font-size: clamp(30px, 4vw, 40px);
	}

	.parents__intro p {
		font-size: 19px;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.steps li {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px 22px;
		border-radius: 24px;
		background: var(--bg);
	}

	.steps__n {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin-bottom: 4px;
		border-radius: 50%;
		background: var(--sun);
		font-family: var(--display);
		font-weight: 800;
		font-size: 22px;
	}

	.steps h3 {
		font-size: 24px;
	}

	.steps p {
		font-size: 17px;
	}

	.parents > .btn {
		align-self: flex-start;
	}

	@media (max-width: 600px) {
		.parents {
			padding: 24px 18px;
			border-radius: 28px;
		}

		.parents > .btn {
			align-self: stretch;
		}
	}

	section {
		scroll-margin-top: 16px;
	}
</style>
