<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';
	import { enterFullscreen } from '$lib/fullscreen';
	import { installed, keepInstallEvent } from '$lib/install.svelte';
	import { SITE } from '$lib/site';
	import { trackEntry, trackView } from '$lib/stats';

	let { children } = $props();

	// The browser's offer to install the app, kept for the button (lib/install.svelte.ts); Svelte has no types for
	// these window events
	onMount(() => {
		addEventListener('beforeinstallprompt', keepInstallEvent);
		addEventListener('appinstalled', installed);
		return () => {
			removeEventListener('beforeinstallprompt', keepInstallEvent);
			removeEventListener('appinstalled', installed);
		};
	});

	// The mode for a child (routes/dziecko) has no menu and no footer: nothing there leads out by a tap
	const kid = $derived(page.route.id === '/dziecko');

	// The menu: where each item leads and which pages belong to it. Its own page is "page", a page under it "true",
	// so that the item stays marked on a song, a guide or a lesson plan.
	const MENU = [
		{
			name: 'Piosenki',
			href: `${resolve('/')}#piosenki`,
			own: '',
			under: ['/piosenka/', '/krotka/', '/playlista/']
		},
		{ name: 'Dla rodziców', href: resolve('/dla-rodzicow'), own: '/dla-rodzicow', under: [] },
		{
			name: 'Dla przedszkoli',
			href: resolve('/dla-przedszkoli'),
			own: '/dla-przedszkoli',
			under: ['/dla-przedszkoli/', '/kolorowanka/']
		},
		{ name: 'Poradniki', href: resolve('/poradnik'), own: '/poradnik', under: ['/poradnik/'] }
	];
	const current = (item: (typeof MENU)[number]) => {
		const path = page.url.pathname;
		if (path === item.own) return 'page';
		return item.under.some((start) => path.startsWith(start)) ? 'true' : undefined;
	};

	// On a narrow screen the menu hides behind a button; it closes with Esc (back on the button), with a tap beside it
	// and when a page opens
	let open = $state(false);
	let toggle = $state<HTMLButtonElement>();
	let header = $state<HTMLElement>();

	const onKey = (event: KeyboardEvent) => {
		if (open && event.key === 'Escape') {
			open = false;
			toggle?.focus();
		}
	};
	const onPointer = (event: PointerEvent) => {
		if (open && !header?.contains(event.target as Node)) open = false;
	};

	// Every page seen is told by the browser, for the statistics without cookies (lib/stats.ts); the first page of a
	// visit also says where it came from. The same page with another ? or # is not a new view.
	afterNavigate(({ type, from, to }) => {
		open = false;
		if (!to) return;
		if (type === 'enter') trackEntry(to.url);
		else if (to.url.pathname !== from?.url.pathname) trackView(to.url.pathname);
	});
</script>

<svelte:window onkeydown={onKey} onpointerdown={onPointer} />

{#if kid}
	<main id="tresc" class="shell main main--kid">
		{@render children()}
	</main>
{:else}
	<a class="skip" href="#tresc">Przejdź do treści</a>

	<header class="shell header" bind:this={header}>
		<a class="header__name" href={resolve('/')}>
			<img src="/pikselek.png" alt="" width="52" height="52" />
			<span>{SITE.name}</span>
		</a>
		<button
			class="header__toggle"
			type="button"
			aria-expanded={open}
			aria-controls="menu"
			bind:this={toggle}
			onclick={() => (open = !open)}
		>
			<Icon name={open ? 'close' : 'menu'} />
			<span>Menu</span>
		</button>
		<div id="menu" class="header__menu" class:header__menu--open={open}>
			<nav aria-label="Menu">
				<ul>
					{#each MENU as item (item.name)}
						<li>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- resolved above -->
							<a href={item.href} aria-current={current(item)}>{item.name}</a>
						</li>
					{/each}
				</ul>
			</nav>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
			<a class="header__youtube-menu" href={SITE.subscribe}
				><Icon name="youtube" /> Subskrybuj na YouTube</a
			>
		</div>
		<a class="header__kid" href={resolve('/dziecko')} onclick={enterFullscreen}
			><Icon name="play" size={20} /><span class="header__wide">Tryb dla dziecka</span><span
				class="header__narrow">Dla dziecka</span
			></a
		>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
		<a class="header__youtube" href={SITE.subscribe}
			><Icon name="youtube" size={22} /><span class="visually-hidden">Subskrybuj na </span><span
				class="header__youtube-name">YouTube</span
			></a
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
				<li><a href={resolve('/dziecko')} onclick={enterFullscreen}>Tryb dla dziecka</a></li>
				<li><a href={resolve('/dla-rodzicow')}>Dla rodziców</a></li>
				<li><a href={resolve('/dla-przedszkoli')}>Dla przedszkoli</a></li>
				<li><a href={resolve('/poradnik')}>Poradniki</a></li>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
				<li><a href={SITE.channel}>Kanał na YouTube</a></li>
				<li><a href={resolve('/prywatnosc')}>Prywatność</a></li>
				<li>
					© {new Date().getFullYear()}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- the site behind this one, as on the other doner.cloud sites -->
					<a href="https://doner.cloud/" target="_blank" rel="noopener"
						>doner.cloud<span class="visually-hidden"> (otwiera się w nowej karcie)</span></a
					>
				</li>
			</ul>
		</div>
	</footer>
{/if}

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

	/* One row at every width: the name, the menu, the mode for a child and YouTube; below 1100 px the menu and
	   YouTube go behind the "Menu" button, in a card under the row */
	.header {
		position: relative;
		z-index: 5;
		display: flex;
		align-items: center;
		gap: 16px;
		padding-block: 16px;
	}

	.header__name {
		flex: none;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 44px;
		margin-right: auto;
		color: var(--ink);
		text-decoration: none;
		font-family: var(--display);
		font-weight: 800;
		font-size: 26px;
		line-height: 1;
		white-space: nowrap;
	}

	.header__name img {
		width: 52px;
		height: 52px;
		border-radius: 16px;
	}

	.header__menu {
		display: flex;
		align-items: center;
	}

	nav ul {
		display: flex;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	nav a {
		display: flex;
		align-items: center;
		min-height: 48px;
		padding: 10px 14px;
		border-radius: 14px;
		color: var(--ink);
		font-weight: 800;
		font-size: 17px;
		text-decoration: none;
		white-space: nowrap;
	}

	nav a:hover {
		background: var(--line);
		color: var(--ink);
	}

	nav a[aria-current] {
		background: var(--sun);
	}

	.header__kid,
	.header__youtube,
	.header__toggle {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 48px;
		border-radius: 16px;
		font:
			800 16px/1.2 'Nunito',
			system-ui,
			sans-serif;
		text-decoration: none;
		white-space: nowrap;
	}

	/* The main way in for a parent with a child beside them */
	.header__kid,
	.header__kid:hover {
		padding: 10px 18px;
		background: var(--blue);
		color: #fff;
		box-shadow: 0 4px 0 var(--blue-edge);
	}

	.header__kid:active {
		transform: translateY(2px);
	}

	.header__youtube {
		padding: 10px 14px;
		background: #fff;
		color: var(--ink);
		box-shadow: inset 0 0 0 2px var(--line);
	}

	.header__youtube:hover {
		color: var(--ink);
		box-shadow: inset 0 0 0 2px var(--lift);
	}

	.header__narrow,
	.header__toggle,
	.header__youtube-menu {
		display: none;
	}

	/* A little less room: YouTube only as its icon (its name stays for screen readers) */
	@media (max-width: 1239px) {
		.header__youtube {
			padding-inline: 12px;
		}

		.header__youtube-name {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	@media (max-width: 1099px) {
		.header {
			gap: 10px;
			padding-block: 12px;
		}

		.header__toggle {
			display: inline-flex;
			order: 2;
			padding: 10px 14px;
			border: 0;
			background: #fff;
			color: var(--ink);
			box-shadow: inset 0 0 0 2px var(--line);
			cursor: pointer;
		}

		.header__toggle[aria-expanded='true'] {
			background: var(--sun);
			box-shadow: none;
		}

		.header__youtube {
			display: none;
		}

		.header__menu {
			display: none;
			position: absolute;
			top: calc(100% - 4px);
			right: 24px;
			width: min(360px, calc(100% - 48px));
			flex-direction: column;
			align-items: stretch;
			gap: 8px;
			padding: 12px;
			border-radius: 24px;
			background: #fff;
			box-shadow:
				0 0 0 2px var(--line),
				0 18px 40px rgb(31 42 68 / 18%);
		}

		.header__menu--open {
			display: flex;
		}

		nav ul {
			flex-direction: column;
		}

		nav a {
			min-height: 52px;
			padding-inline: 16px;
			font-size: 19px;
		}

		.header__youtube-menu {
			display: flex;
			align-items: center;
			gap: 10px;
			min-height: 52px;
			padding: 10px 16px;
			border-top: 2px solid var(--line);
			color: var(--ink);
			font-weight: 800;
			text-decoration: none;
		}
	}

	/* A phone: "Menu" only as its icon (the word stays for screen readers), the button for a child shorter */
	@media (max-width: 600px) {
		.header {
			gap: 8px;
		}

		.header__name {
			gap: 10px;
			font-size: 21px;
		}

		.header__name img {
			width: 44px;
			height: 44px;
			border-radius: 14px;
		}

		.header__menu {
			right: 16px;
			width: calc(100% - 32px);
		}

		.header__kid {
			padding-inline: 12px;
		}

		.header__wide {
			display: none;
		}

		.header__narrow {
			display: inline;
		}

		.header__toggle {
			padding-inline: 12px;
		}

		.header__toggle span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	/* A narrow phone: the name in two lines */
	@media (max-width: 480px) {
		.header__name {
			font-size: 20px;
			white-space: normal;
		}

		.header__name span {
			max-width: 5em;
		}

		.header__kid {
			gap: 6px;
			padding-inline: 10px;
			font-size: 15px;
		}
	}

	/* Most phones: the button for a child only as its words, a smaller Pikselek */
	@media (max-width: 400px) {
		.header__name img {
			width: 40px;
			height: 40px;
		}

		.header__kid :global(svg) {
			display: none;
		}
	}

	/* The narrowest phones: the button for a child only as its icon, with its name for screen readers */
	@media (max-width: 349px) {
		.header__kid :global(svg) {
			display: block;
		}

		.header__narrow {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
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

	.main--kid {
		gap: 28px;
		padding-top: 16px;
		padding-bottom: 40px;
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
		gap: 0 24px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-weight: 700;
	}

	/* 44 px to tap */
	.footer li a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
</style>
