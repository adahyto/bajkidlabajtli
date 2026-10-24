<script lang="ts">
	// Icons of the site, drawn with the current text colour; always beside a text or a label that says the same
	let { name, size = 24 }: { name: keyof typeof PATHS; size?: number } = $props();

	const PATHS = {
		play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
		back: '<path d="M15 5l-7 7 7 7"/>',
		next: '<path d="M9 5l7 7-7 7"/>',
		again: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
		skip: '<path d="M5 4.5v15l10-7.5z" fill="currentColor" stroke="none"/><path d="M18 5v14"/>',
		list: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
		shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
		phone:
			'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
		down: '<path d="M6 9l6 6 6-6"/>',
		download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
		youtube:
			'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9v6l5-3z" fill="currentColor" stroke="none"/>',
		menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
		close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
		expand:
			'<path d="M4 9V4h5"/><path d="M15 4h5v5"/><path d="M20 15v5h-5"/><path d="M9 20H4v-5"/>',
		heart:
			'<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
		book: '<path d="M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14"/><path d="M9 8h7"/>',
		print:
			'<path d="M7 9V3h10v6"/><path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- fixed paths above -->
	{@html PATHS[name]}
</svg>
