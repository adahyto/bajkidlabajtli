<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '$lib/site';

	/** Title, description and the preview of the page for search engines and messengers */
	let {
		title,
		description = SITE.description,
		image = '/pikselek.png',
		type = 'website'
	}: { title: string; description?: string; image?: string; type?: string } = $props();

	const canonical = $derived(new URL(page.url.pathname, page.url.origin).href);
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
</svelte:head>
