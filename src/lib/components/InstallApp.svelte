<script lang="ts">
	import { onMount } from 'svelte';
	import { install, installed, isApple, runsAsApp } from '$lib/install.svelte';
	import Icon from './Icon.svelte';

	/*
	 * "Zainstaluj aplikację" where the browser offers it (lib/install.svelte.ts), a how-to on an iPhone or iPad,
	 * nothing in the app itself or in a browser that cannot install it. Shown only in the browser, after the page
	 * has started: the server does not know which one it is.
	 */
	let { white = false }: { white?: boolean } = $props();

	let ready = $state(false);
	let app = $state(false);
	let apple = $state(false);

	onMount(() => {
		app = runsAsApp();
		apple = isApple();
		ready = true;
	});

	async function ask() {
		const event = install.event;
		if (!event) return;
		await event.prompt();
		const { outcome } = await event.userChoice;
		// The browser offers it once per event; after a "no" the button waits for the next one
		install.event = null;
		if (outcome === 'accepted') installed();
	}
</script>

{#if ready && !app && !install.installed}
	{#if install.event}
		<button
			type="button"
			class="btn"
			class:btn--blue={!white}
			class:btn--white={white}
			onclick={ask}
		>
			<Icon name="download" /> Zainstaluj aplikację
		</button>
	{:else if apple}
		<p class="apple">
			<strong>Aplikacja na iPhonie i iPadzie:</strong> w Safari stuknij „Udostępnij”
			<span aria-hidden="true">(□↑)</span> i wybierz „Do ekranu początkowego”.
		</p>
	{/if}
{/if}

<style>
	.apple {
		max-width: 46ch;
		padding: 12px 16px;
		border-radius: 18px;
		background: var(--card);
		box-shadow: inset 0 0 0 2px var(--line);
		font-size: 16px;
	}
</style>
