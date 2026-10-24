<script lang="ts">
	import { resolve } from '$app/paths';
	import { enterFullscreen } from '$lib/fullscreen';
	import Icon from './Icon.svelte';

	/** For a parent: the mode for a child (routes/dziecko), on the whole screen where the browser can */
	let { white = false }: { white?: boolean } = $props();
</script>

<a
	class="btn"
	class:btn--blue={!white}
	class:btn--white={white}
	href={resolve('/dziecko')}
	onclick={enterFullscreen}><Icon name="play" /> Tryb dla dziecka</a
>
