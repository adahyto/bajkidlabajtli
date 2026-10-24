<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SITE } from '$lib/site';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Nie ma takiej strony' : 'Coś poszło nie tak'} | {SITE.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error">
	<img src="/pikselek.png" alt="" width="160" height="160" />
	<h1>{page.status === 404 ? 'Ups! Tu nic nie ma.' : 'Ups! Coś poszło nie tak.'}</h1>
	<p>
		{page.status === 404
			? 'Może ta piosenka ma nowy adres. Wszystkie są na stronie głównej.'
			: 'Spróbuj jeszcze raz za chwilę.'}
	</p>
	<a class="btn btn--blue" href={resolve('/')}>Wszystkie piosenki</a>
</section>

<style>
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		padding: 48px 24px;
		border-radius: 36px;
		background: var(--sun);
		text-align: center;
	}

	.error img {
		border-radius: 40px;
	}

	h1 {
		font-size: clamp(34px, 5vw, 52px);
	}
</style>
