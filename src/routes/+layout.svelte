<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { SITE } from '$lib/site';
	import { trackEntry, trackView } from '$lib/stats';

	let { children } = $props();

	// Every page seen is told by the browser, for the statistics without cookies (lib/stats.ts); the first page of a
	// visit also says where it came from. The same page with another ? or # is not a new view.
	afterNavigate(({ type, from, to }) => {
		if (!to) return;
		if (type === 'enter') trackEntry(to.url);
		else if (to.url.pathname !== from?.url.pathname) trackView(to.url.pathname);
	});
</script>

<a class="skip" href="#tresc">Przejdź do treści</a>

<header class="shell header">
	<a class="header__name" href={resolve('/')}>
		<img src="/pikselek.png" alt="" width="52" height="52" />
		<span>{SITE.name}</span>
	</a>
	<nav aria-label="Menu">
		<!-- eslint-disable svelte/no-navigation-without-resolve -- parts of the resolved home page -->
		<ul>
			<li><a href={`${resolve('/')}#piosenki`}>Piosenki</a></li>
			<li><a href={`${resolve('/')}#krotkie`}>Krótkie</a></li>
			<li><a href={`${resolve('/')}#playlisty`}>Playlisty</a></li>
			<li><a href={`${resolve('/')}#rodzice`}>Dla rodziców</a></li>
		</ul>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</nav>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
	<a class="header__subscribe" href={SITE.subscribe}
		>Subskrybuj<span class="header__wide">na YouTube</span></a
	>
</header>

<main id="tresc" class="shell main">
	{@render children()}
</main>

<footer class="footer">
	<div class="shell footer__inner">
		<p class="footer__name">
			<img src="/pikselek.png" alt="" width="40" height="40" loading="lazy" />
			{SITE.name} · nowe piosenki co tydzień
		</p>
		<ul>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
			<li><a href={SITE.channel}>Kanał na YouTube</a></li>
			<li><a href={resolve('/prywatnosc')}>Prywatność</a></li>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- an e-mail address -->
			<li><a href={`mailto:${SITE.email}`}>Kontakt</a></li>
		</ul>
	</div>
</footer>

<style>
	.skip {
		position: absolute;
		left: 16px;
		top: -100px;
		z-index: 10;
		padding: 12px 18px;
		border-radius: 14px;
		background: var(--ink);
		color: #fff;
		font-weight: 800;
	}

	.skip:focus {
		top: 12px;
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 24px;
		padding-block: 20px;
	}

	.header__name {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--ink);
		text-decoration: none;
		font-family: var(--display);
		font-weight: 800;
		font-size: 26px;
		line-height: 1;
	}

	.header__name img {
		width: 52px;
		height: 52px;
		border-radius: 16px;
	}

	nav {
		flex: 1 1 auto;
	}

	nav ul {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	nav a {
		display: block;
		padding: 10px 14px;
		border-radius: 12px;
		color: var(--ink);
		font-weight: 800;
		font-size: 17px;
		text-decoration: none;
	}

	nav a:hover {
		background: var(--line);
		color: var(--ink);
	}

	/* A flex row drops the space between the words: the gap is it */
	.header__subscribe {
		display: inline-flex;
		align-items: center;
		column-gap: 0.28em;
		min-height: 48px;
		padding: 12px 18px;
		border-radius: 16px;
		background: var(--ink);
		color: #fff;
		font-weight: 800;
		font-size: 16px;
		text-decoration: none;
	}

	.header__subscribe:hover {
		color: var(--sun);
	}

	/* On a phone: the name and the button in a row, the menu under them, sideways if it must */
	@media (max-width: 720px) {
		.header {
			padding-block: 14px;
		}

		.header__name {
			flex: 1 1 auto;
			font-size: 22px;
		}

		.header__name img {
			width: 44px;
			height: 44px;
			border-radius: 14px;
		}

		.header__subscribe {
			padding: 10px 14px;
			font-size: 15px;
		}

		.header__wide {
			display: none;
		}

		nav {
			order: 3;
			flex-basis: 100%;
			margin-inline: -16px;
			overflow-x: auto;
		}

		nav ul {
			flex-wrap: nowrap;
			padding-inline: 10px;
		}

		nav a {
			white-space: nowrap;
			background: #fff;
		}
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 72px;
		padding-top: 8px;
		padding-bottom: 72px;
	}

	@media (max-width: 600px) {
		.main {
			gap: 48px;
		}
	}

	.footer {
		border-top: 2px solid var(--line);
	}

	.footer__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px 32px;
		padding-block: 32px 48px;
		font-size: 16px;
	}

	.footer__name {
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 700;
	}

	.footer__name img {
		width: 40px;
		height: 40px;
		border-radius: 12px;
	}

	.footer ul {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-weight: 700;
	}
</style>
