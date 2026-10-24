<script lang="ts">
	import { page } from '$app/state';
	import { ldScript, type JsonLd } from '$lib/jsonld';
	import { SITE } from '$lib/site';

	/** Title, description and the preview of the page for search engines and messengers, and what lib/jsonld.ts says */
	let {
		title,
		description = SITE.description,
		image = '/udostepnij.png',
		type = 'website',
		canonical: path,
		jsonld
	}: {
		title: string;
		description?: string;
		image?: string;
		type?: string;
		/** Another page that says the same, for search engines; this page's own address when not given */
		canonical?: string;
		jsonld?: JsonLd | JsonLd[];
	} = $props();

	const canonical = $derived(new URL(path ?? page.url.pathname, page.url.origin).href);
	const blocks = $derived(jsonld ? [jsonld].flat() : []);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:locale" content="pl_PL" />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={new URL(image, page.url.origin).href} />
	<meta name="twitter:card" content="summary_large_image" />
	{#each blocks as block, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON made by lib/jsonld.ts, with "<" escaped -->
		{@html ldScript(block)}
	{/each}
</svelte:head>
