<script lang="ts">
	import SongPage from '$lib/components/SongPage.svelte';

	let { data } = $props();
</script>

<SongPage {data} />
