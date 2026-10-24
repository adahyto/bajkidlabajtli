<script lang="ts" module>
	/* eslint-disable @typescript-eslint/no-explicit-any -- the YouTube IFrame API has no types here */
	type YT = any;
	let api: Promise<YT> | null = null;

	/** YouTube's player script, loaded once, on the first click on a video (never before: /prywatnosc) */
	function loadApi(): Promise<YT> {
		api ??= new Promise<YT>((resolve, reject) => {
			const w = window as any;
			if (w.YT?.Player) return resolve(w.YT);
			const before = w.onYouTubeIframeAPIReady;
			w.onYouTubeIframeAPIReady = () => {
				before?.();
				resolve(w.YT);
			};
			const script = document.createElement('script');
			script.src = 'https://www.youtube.com/iframe_api';
			script.onerror = () => {
				api = null;
				reject(new Error('YouTube player script not loaded'));
			};
			document.head.append(script);
			setTimeout(() => reject(new Error('YouTube player script too slow')), 15_000);
		});
		return api;
	}
</script>

<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import { bigOf, thumbOf } from '$lib/cards';
	import Icon from './Icon.svelte';

	type Item = { id: string; title: string };

	/*
	 * A video of the channel: its picture with a big button until it is clicked, then YouTube's player from
	 * www.youtube-nocookie.com. When the video ends, the site's own two buttons cover YouTube's suggestions (which
	 * may be of other channels): "Jeszcze raz" and the next song (`next`, a link). With `queue` (a playlist) the next
	 * one plays by itself and `index` follows it, or, with `ask`, the end screen has "Następna" for it (the mode for a
	 * child, routes/dziecko). `autostart` plays at once, for a click that opened the player. If YouTube's script does
	 * not load, a plain frame plays the video, without the end screen. A video that will not play here links to
	 * YouTube, but with `closed` (the mode for a child, where nothing leads out) it only offers to try again.
	 * Without the internet it says so, with "Spróbuj jeszcze raz". `started` turns true once a video plays, for the
	 * page to drop its "włączy się po kliknięciu".
	 *
	 * The channel's songs have their words in the picture, so YouTube's captions start off: they would cover them.
	 * A viewer can still turn them on with the player's CC button.
	 */
	let {
		queue,
		index = $bindable(0),
		next = null,
		vertical = false,
		ask = false,
		autostart = false,
		closed = false,
		// eslint-disable-next-line no-useless-assignment -- a bindable prop: the page reads it
		started = $bindable(false)
	}: {
		queue: Item[];
		index?: number;
		next?: { href: string; title: string } | null;
		vertical?: boolean;
		ask?: boolean;
		autostart?: boolean;
		closed?: boolean;
		started?: boolean;
	} = $props();

	const item = $derived(queue[index] ?? queue[0]);
	let box: HTMLDivElement | undefined = $state();
	let phase: 'poster' | 'loading' | 'playing' | 'ended' | 'frame' | 'error' | 'offline' =
		$state('poster');
	$effect(() => {
		if (phase === 'playing' || phase === 'frame') started = true;
	});
	let player: YT | null = null;
	let loadedId = '';
	// The video whose captions were turned off when it started; a later click on CC keeps them on
	let captionsOff = '';
	let firstButton: HTMLElement | undefined = $state();

	function destroy() {
		try {
			player?.destroy();
		} catch {
			// already gone
		}
		player = null;
		loadedId = '';
		// YouTube's frame is not Svelte's: it took the place of the element start() put in the empty box
		// eslint-disable-next-line svelte/no-dom-manipulating
		box?.replaceChildren();
	}

	async function start() {
		if (!box || phase === 'loading') return;
		// The app works without the internet (src/service-worker.ts), YouTube does not
		if (!navigator.onLine) {
			phase = 'offline';
			return;
		}
		phase = 'loading';
		const id = item.id;
		try {
			const YT = await loadApi();
			destroy();
			const target = document.createElement('div');
			// YouTube replaces this element with its frame; Svelte keeps the box empty
			// eslint-disable-next-line svelte/no-dom-manipulating
			box.append(target);
			loadedId = id;
			player = new YT.Player(target, {
				host: 'https://www.youtube-nocookie.com',
				videoId: id,
				width: '100%',
				height: '100%',
				playerVars: {
					autoplay: 1,
					rel: 0,
					playsinline: 1,
					iv_load_policy: 3,
					hl: 'pl',
					cc_load_policy: 0,
					origin: location.origin
				},
				events: {
					onStateChange: (e: { data: number }) => {
						if (e.data === YT.PlayerState.PLAYING) {
							phase = 'playing';
							captionsOffOnce();
						}
						if (e.data === YT.PlayerState.ENDED) ended();
					},
					onError: () => (phase = 'error')
				}
			});
			phase = 'playing';
		} catch {
			phase = navigator.onLine ? 'frame' : 'offline';
		}
	}

	/** Captions off when a video starts (unloadModule is not in YouTube's documentation, so it may do nothing) */
	function captionsOffOnce() {
		if (!player || captionsOff === loadedId) return;
		captionsOff = loadedId;
		try {
			player.unloadModule('captions');
			player.unloadModule('cc');
		} catch {
			// the video plays on, with what YouTube shows
		}
	}

	function ended() {
		if (queue.length > 1 && index < queue.length - 1 && !next && !ask) {
			// A playlist: on to the next song
			index += 1;
			return;
		}
		phase = 'ended';
		requestAnimationFrame(() => firstButton?.focus());
	}

	function again() {
		if (queue.length > 1 && !next && !ask && index === queue.length - 1) {
			index = 0;
			return;
		}
		player?.seekTo(0, true);
		player?.playVideo();
		phase = 'playing';
	}

	// Another video in the same place (the next song of a playlist, or another song's page reached from here):
	// a player that is already open plays it, otherwise its picture shows
	$effect(() => {
		const id = item.id;
		untrack(() => {
			if (player && loadedId !== id) {
				loadedId = id;
				player.loadVideoById(id);
				phase = 'playing';
			} else if (!player && phase !== 'frame') {
				phase = 'poster';
			}
		});
	});

	/** "Następna" with `ask`: the next one in the queue, after the last the first */
	const onward = () => (index = (index + 1) % queue.length);

	function retry() {
		destroy();
		phase = 'poster';
		start();
	}

	onMount(() => {
		if (autostart) start();
	});

	onDestroy(destroy);
</script>

<div class="player" class:player--vertical={vertical}>
	{#if phase === 'frame'}
		<iframe
			src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1&hl=pl&cc_load_policy=0`}
			title={item.title}
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
	{:else}
		<div class="player__frame" bind:this={box}></div>
	{/if}

	{#if phase === 'poster' || phase === 'loading'}
		<button
			type="button"
			class="player__poster"
			onclick={start}
			aria-label={`Włącz: ${item.title}`}
		>
			<img
				src={thumbOf(item.id, vertical ? 's' : 'l')}
				srcset={vertical ? undefined : bigOf(item.id)}
				sizes="(max-width: 600px) 100vw, 900px"
				alt=""
				width={vertical ? 540 : 1280}
				height={vertical ? 960 : 720}
			/>
			<span class="player__play" class:player__play--busy={phase === 'loading'}>
				<Icon name="play" size={52} />
			</span>
		</button>
	{/if}

	{#if phase === 'ended'}
		<div class="player__end">
			<p class="player__end-title">Koniec! Co teraz?</p>
			<div class="player__end-buttons">
				<button type="button" class="player__choice" onclick={again} bind:this={firstButton}>
					<Icon name="again" size={32} />
					{queue.length > 1 && !next && !ask ? 'Od początku' : 'Jeszcze raz'}
				</button>
				{#if ask && queue.length > 1}
					<button type="button" class="player__choice player__choice--next" onclick={onward}>
						<Icon name="skip" size={32} />
						<span
							>Następna<span class="visually-hidden"
								>: {queue[(index + 1) % queue.length].title}</span
							></span
						>
					</button>
				{/if}
				{#if next}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- next.href is a resolved path -->
					<a class="player__choice player__choice--next" href={next.href}>
						<Icon name="skip" size={32} />
						<span>Następna<span class="visually-hidden">: {next.title}</span></span>
					</a>
				{/if}
			</div>
		</div>
	{/if}

	{#if phase === 'offline'}
		<div class="player__end">
			<p class="player__end-title">Nie ma internetu</p>
			<p>Piosenka zagra, gdy internet wróci.</p>
			<button type="button" class="player__choice" onclick={retry}>
				<Icon name="again" size={32} /> Spróbuj jeszcze raz
			</button>
		</div>
	{/if}

	{#if phase === 'error'}
		<div class="player__end">
			<p class="player__end-title">Ten film nie chce się tu włączyć</p>
			{#if closed}
				<button type="button" class="player__choice" onclick={retry}>
					<Icon name="again" size={32} /> Spróbuj jeszcze raz
				</button>
			{:else}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- YouTube -->
				<a class="player__choice" href={`https://www.youtube.com/watch?v=${item.id}`}>
					Obejrzyj na YouTube
				</a>
			{/if}
		</div>
	{/if}
</div>

<style>
	.player {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 32px;
		overflow: hidden;
		background: var(--ink);
		box-shadow: 0 10px 0 rgb(31 42 68 / 0.18);
	}

	/* As tall as the screen allows, as wide as that makes it */
	.player--vertical {
		aspect-ratio: 9 / 16;
		height: min(78vh, 760px);
		width: auto;
		max-width: 100%;
		margin-inline: auto;
	}

	.player__frame,
	.player__frame :global(iframe),
	iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.player__poster {
		position: absolute;
		inset: 0;
		padding: 0;
		border: 0;
		background: var(--ink);
		cursor: pointer;
	}

	.player__poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.player__play {
		position: absolute;
		inset: 0;
		margin: auto;
		width: clamp(84px, 14vw, 128px);
		height: clamp(84px, 14vw, 128px);
		border-radius: 50%;
		background: var(--blue);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 0 10px rgb(255 255 255 / 0.9);
		transition: transform 0.12s;
	}

	.player__poster:hover .player__play {
		transform: scale(1.06);
	}

	.player__play--busy {
		opacity: 0.7;
	}

	.player__end {
		position: absolute;
		inset: 0;
		padding: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: rgb(31 42 68 / 0.92);
		color: #fff;
		text-align: center;
	}

	.player__end-title {
		font-family: var(--display);
		font-weight: 800;
		font-size: clamp(22px, 4vw, 40px);
		line-height: 1.1;
	}

	.player__end-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(0, 220px));
		justify-content: center;
		gap: 14px;
		width: 100%;
	}

	.player__choice {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 64px;
		padding: clamp(10px, 2vw, 22px) 12px;
		border: 0;
		border-radius: 22px;
		background: #fff;
		color: var(--ink);
		font:
			800 clamp(16px, 2vw, 21px) / 1.2 'Nunito',
			system-ui,
			sans-serif;
		text-decoration: none;
		cursor: pointer;
	}

	.player__choice:hover {
		color: var(--ink);
	}

	.player__choice--next,
	.player__choice--next:hover {
		background: var(--blue);
		color: #fff;
	}

	.player--vertical .player__end-buttons {
		grid-template-columns: minmax(0, 220px);
	}
</style>
