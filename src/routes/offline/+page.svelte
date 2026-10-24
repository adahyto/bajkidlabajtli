<script lang="ts">
	import { resolve } from '$app/paths';
	import { SITE } from '$lib/site';
	import Head from '$lib/components/Head.svelte';
	import Icon from '$lib/components/Icon.svelte';

	/*
	 * What the app shows (src/service-worker.ts) for a page it has not kept, when there is no internet. The pages it
	 * keeps from the start are linked here.
	 */
</script>

<Head
	title={`Nie ma internetu | ${SITE.name}`}
	description="Ta strona nie jest zapisana w telefonie, a teraz nie ma internetu."
/>
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="offline" aria-labelledby="offline-h">
	<img src="/pikselek.png" alt="" width="160" height="160" />
	<h1 id="offline-h">Nie ma internetu</h1>
	<p>
		Tej strony nie ma jeszcze w telefonie. Bez internetu działają tryb dla dziecka i strona dla
		rodziców, ale piosenki z YouTube zagrają dopiero, gdy internet wróci.
	</p>
	<div class="offline__buttons">
		<button type="button" class="btn btn--blue" onclick={() => location.reload()}>
			<Icon name="again" /> Spróbuj jeszcze raz
		</button>
		<a class="btn btn--white" href={resolve('/dziecko')}>Tryb dla dziecka</a>
		<a class="btn btn--white" href={resolve('/dla-rodzicow')}>Dla rodziców</a>
	</div>
</section>

<style>
	.offline {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 48px 24px;
		text-align: center;
	}

	.offline img {
		border-radius: 40px;
	}

	h1 {
		font-size: clamp(36px, 6vw, 56px);
	}

	p {
		max-width: 560px;
		font-size: 20px;
	}

	.offline__buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px;
	}
</style>
