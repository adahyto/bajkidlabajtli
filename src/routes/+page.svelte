<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { pathOf, thumbOf } from '$lib/cards';
	import { clock, songs } from '$lib/format';
	import { siteLd } from '$lib/jsonld';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import VideoCard from '$lib/components/VideoCard.svelte';

	let { data } = $props();
</script>

<Head title={`${SITE.name} — piosenki z Pikselkiem dla dzieci`} jsonld={siteLd(page.url.origin)} />

{#if data.hero}
	<section class="hero">
		<div class="hero__text">
			<span class="badge">NOWA PIOSENKA</span>
			<h1>Śpiewaj z Pikselkiem!</h1>
			<p>
				Krótkie piosenki dla dzieci 3–8 lat. W każdej jedna prosta zasada, zaśpiewana tak, żeby
				została w głowie.
			</p>
			<div class="hero__buttons">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
				<a class="btn btn--blue" href={pathOf(data.hero)}><Icon name="play" /> Włącz najnowszą</a>
				<a class="btn btn--white" href="#piosenki">Wszystkie piosenki</a>
			</div>
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
			<span class="hero__title"><span class="visually-hidden">Włącz: </span>{data.hero.title}</span>
			{#if data.hero.seconds}<span class="hero__time">{clock(data.hero.seconds)}</span>{/if}
		</a>
	</section>
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
		<div class="grid">
			{#each data.songs as card, i (card.id)}
				<VideoCard {card} eager={i < 4} />
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
		<div class="grid grid--shorts">
			{#each data.shorts as card (card.id)}
				<VideoCard {card} />
			{/each}
		</div>
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
							<Icon name="play" /> Odtwórz wszystkie po kolei
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
			Każda piosenka to jedna prosta zasada: jak bezpiecznie klikać w internecie, co zrobić, gdy
			dziecko się zgubi, czym niespodzianka różni się od sekretu. Wszystkie są autorskie, animacje
			proste i kolorowe, bez krzyku i bez reklam zabawek. Po piosence łatwo zacząć rozmowę o trudnym
			temacie bez trudnych słów.
		</p>
	</div>

	{#if data.rules.length}
		<div class="table">
			<table>
				<thead>
					<tr>
						<th scope="col">Piosenka</th>
						<th scope="col">O czym jest</th>
						<th scope="col">Pierwsza zasada</th>
					</tr>
				</thead>
				<tbody>
					{#each data.rules as row (row.card.id)}
						<tr>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pathOf gives the page of the song -->
							<th scope="row"><a href={pathOf(row.card)}>{row.card.title}</a></th>
							<td>{row.about}</td>
							<td class="table__rule"
								><span aria-hidden="true">{row.rule.icon}</span> {row.rule.text}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="parents__more">
			<p>
				Przy każdej piosence są wszystkie jej zasady, pytania do rozmowy z dzieckiem i wskazówki dla
				rodziców. Wszystkie razem, także do wydruku:
			</p>
			<a class="btn btn--blue" href={resolve('/dla-rodzicow')}>Wszystko dla rodziców</a>
		</div>
	{/if}

	<div class="facts">
		<div class="fact">
			<Icon name="shield" size={32} />
			<h3>YouTube dopiero po kliknięciu</h3>
			<p>
				Do tego czasu strona nie łączy się z YouTube. Odtwarzacz działa w trybie rozszerzonej
				prywatności. <a href={resolve('/prywatnosc')}>Więcej o prywatności</a>
			</p>
		</div>
		<div class="fact">
			<Icon name="again" size={32} />
			<h3>Po piosence bez obcych filmów</h3>
			<p>
				Zamiast podpowiedzi YouTube dziecko widzi dwa duże przyciski: „Jeszcze raz” i „Następna”.
			</p>
		</div>
	</div>
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

	.hero__text p {
		font-size: 20px;
		max-width: 32ch;
	}

	.hero__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		padding-top: 4px;
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

		/* Only for screen readers: the name of the link */
		.hero__title {
			width: 1px;
			height: 1px;
			padding: 0;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		.hero__buttons,
		.hero__buttons .btn {
			width: 100%;
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 24px;
	}

	.grid--shorts {
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 20px;
	}

	@media (max-width: 600px) {
		.grid--shorts {
			display: flex;
			overflow-x: auto;
			margin-inline: -16px;
			padding: 0 16px 12px;
			gap: 12px;
		}

		.grid--shorts > :global(*) {
			flex: none;
			width: 160px;
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

	.parents__more {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px 24px;
		margin-top: -12px;
	}

	.parents__more p {
		flex: 1 1 360px;
		color: var(--muted);
	}

	.table {
		overflow-x: auto;
		border-radius: 24px;
		box-shadow: inset 0 0 0 2px var(--line);
	}

	table {
		width: 100%;
		min-width: 640px;
		border-collapse: collapse;
		font-size: 17px;
		line-height: 1.45;
	}

	th,
	td {
		padding: 16px 20px;
		text-align: left;
		vertical-align: top;
	}

	thead tr {
		background: var(--bg);
	}

	tbody tr {
		border-top: 2px solid var(--line);
	}

	.table__rule {
		font-weight: 700;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
		color: var(--blue);
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 24px;
		border-radius: 24px;
		background: var(--bg);
	}

	.fact h3 {
		color: var(--ink);
		font-family: 'Nunito', system-ui, sans-serif;
		font-size: 20px;
	}

	.fact p {
		color: var(--ink);
		font-size: 17px;
	}

	@media (max-width: 600px) {
		.parents {
			padding: 24px 18px;
			border-radius: 28px;
		}
	}

	section {
		scroll-margin-top: 16px;
	}
</style>
