<script lang="ts">
	import type { Scene } from '$lib/lessons';

	/*
	 * A colouring page: Pikselek (the channel's blue square, drawn here as outlines) with what his song is about, black
	 * lines on white, big closed shapes for small hands. One drawing, eight scenes (lib/lessons.ts). The picture says
	 * nothing a screen reader needs beyond its label.
	 */
	let { scene, label }: { scene: Scene; label: string } = $props();

	// Which arm is up: towards what Pikselek holds or points at
	const leftUp = $derived(
		scene === 'drzewo' || scene === 'monetki' || scene === 'ksiazki' || scene === 'koparka'
	);
	const rightUp = $derived(
		scene === 'tablet' || scene === 'telefon' || scene === 'prezent' || scene === 'hustawka'
	);
</script>

<svg
	class="coloring"
	viewBox="10 64 600 500"
	role="img"
	aria-label={label}
	fill="#fff"
	stroke="#111"
	stroke-width="6"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<!-- The ground -->
	<path d="M20 548 Q300 516 580 548" fill="none" />

	{#if scene === 'drzewo'}
		<!-- A tree to stand like, and the balloon Pikselek chased -->
		<rect x="480" y="330" width="44" height="210" rx="10" />
		<path
			d="M420 330 C380 320 384 258 432 252 C428 196 492 176 516 214 C548 180 604 214 584 262 C612 286 590 344 548 336 C528 360 452 360 420 330 Z"
		/>
		<path d="M502 300 Q512 284 530 286" fill="none" stroke-width="4" />
		<path d="M118 196 Q102 230 124 252 Q144 270 128 296" fill="none" stroke-width="4" />
		<ellipse cx="116" cy="130" rx="46" ry="58" />
		<path d="M108 186 L124 186 L116 198 Z" />
		<path d="M96 104 Q104 90 118 88" fill="none" stroke-width="4" />
	{:else if scene === 'prezent'}
		<!-- A present, a heart -->
		<rect x="436" y="408" width="124" height="124" rx="8" />
		<rect x="424" y="380" width="148" height="34" rx="8" />
		<rect x="486" y="380" width="24" height="152" />
		<path d="M498 378 C470 330 432 350 452 374 Z" />
		<path d="M498 378 C526 330 564 350 544 374 Z" />
		<path
			d="M120 214 C120 214 52 172 52 128 C52 100 76 84 98 92 C110 96 118 106 120 114 C122 106 130 96 142 92 C164 84 188 100 188 128 C188 172 120 214 120 214 Z"
		/>
	{:else if scene === 'monetki'}
		<!-- Coins in a pile and one big one -->
		{#each [0, 1, 2, 3] as i (i)}
			<path d={`M440 ${520 - i * 26} v-18 a60 18 0 0 0 120 0 v18`} />
			<ellipse cx="500" cy={502 - i * 26} rx="60" ry="18" />
		{/each}
		<circle cx="130" cy="160" r="62" />
		<circle cx="130" cy="160" r="45" stroke-width="4" />
		<path
			d="M130 132 L138 150 L158 151 L143 164 L148 184 L130 173 L112 184 L117 164 L102 151 L122 150 Z"
			stroke-width="4"
		/>
		<circle cx="520" cy="300" r="34" />
		<circle cx="520" cy="300" r="22" stroke-width="4" />
	{:else if scene === 'tablet'}
		<!-- A tablet with a friendly face, and a question -->
		<rect x="436" y="250" width="140" height="190" rx="18" />
		<rect x="452" y="270" width="108" height="140" rx="6" stroke-width="4" />
		<circle cx="506" cy="424" r="7" stroke-width="4" />
		<circle cx="488" cy="326" r="7" fill="#111" stroke="none" />
		<circle cx="524" cy="326" r="7" fill="#111" stroke="none" />
		<path d="M484 352 Q506 372 528 352" fill="none" stroke-width="4" />
		<path
			d="M60 150 Q60 92 130 92 Q200 92 200 150 Q200 206 136 206 L112 238 L114 204 Q60 196 60 150 Z"
		/>
		<path
			d="M110 132 Q110 112 130 112 Q150 112 150 130 Q150 144 132 150 L130 166"
			fill="none"
			stroke-width="8"
		/>
		<circle cx="130" cy="186" r="6" fill="#111" stroke="none" />
	{:else if scene === 'telefon'}
		<!-- A phone with 112 on its screen -->
		<rect x="452" y="150" width="104" height="184" rx="18" />
		<rect x="466" y="172" width="76" height="130" rx="6" stroke-width="4" />
		<text
			x="504"
			y="252"
			text-anchor="middle"
			font-family="'Baloo 2', 'Nunito', sans-serif"
			font-weight="800"
			font-size="40"
			fill="#111"
			stroke="none">112</text
		>
		<path d="M580 186 Q598 210 580 234" fill="none" stroke-width="4" />
		<path d="M590 166 Q620 210 590 254" fill="none" stroke-width="4" />
		<text
			x="120"
			y="190"
			text-anchor="middle"
			font-family="'Baloo 2', 'Nunito', sans-serif"
			font-weight="800"
			font-size="120"
			fill="#fff"
			stroke-width="10"
			paint-order="stroke">112</text
		>
	{:else if scene === 'hustawka'}
		<!-- A swing to wait for, held by its rope, and the counting while one waits -->
		<path d="M444 540 L462 196 M592 540 L574 196" fill="none" stroke-width="10" />
		<rect x="440" y="182" width="156" height="22" rx="10" />
		<path d="M480 204 V432 M556 204 V432" fill="none" stroke-width="4" />
		<rect x="462" y="430" width="112" height="18" rx="8" />
		<text
			x="120"
			y="200"
			text-anchor="middle"
			font-family="'Baloo 2', 'Nunito', sans-serif"
			font-weight="800"
			font-size="84"
			fill="#fff"
			stroke-width="8"
			paint-order="stroke">1, 2, 3</text
		>
	{:else if scene === 'ksiazki'}
		<!-- An open book held up, and a pile of books from the library -->
		<path d="M124 150 Q84 128 34 144 V250 Q84 234 124 256 Z" />
		<path d="M124 150 Q164 128 214 144 V250 Q164 234 124 256 Z" />
		<path
			d="M52 170 Q80 162 106 172 M52 196 Q80 188 106 198 M142 172 Q168 162 196 170 M142 198 Q168 188 196 196"
			fill="none"
			stroke-width="4"
		/>
		<rect x="440" y="492" width="150" height="40" rx="6" />
		<rect x="454" y="452" width="128" height="40" rx="6" />
		<rect x="434" y="412" width="140" height="40" rx="6" />
		<path d="M462 492 V532 M476 452 V492 M456 412 V452" fill="none" stroke-width="4" />
	{:else if scene === 'koparka'}
		<!-- An excavator with its bucket up over Pikselek, who shows it too: "łyżka w górę" -->
		<rect x="430" y="500" width="166" height="40" rx="20" />
		{#each [454, 513, 572] as x (x)}
			<circle cx={x} cy="520" r="11" stroke-width="4" />
		{/each}
		<rect x="444" y="430" width="140" height="70" rx="10" />
		<rect x="516" y="350" width="68" height="80" rx="10" />
		<rect x="528" y="362" width="44" height="40" rx="6" stroke-width="4" />
		<path d="M474 436 L446 188 L476 180 L506 430 Z" />
		<path d="M458 166 L336 150 L332 178 L456 200 Z" />
		<circle cx="460" cy="184" r="14" />
		<path d="M344 146 Q286 140 280 190 L300 236 L350 218 Z" />
		<path d="M306 234 L310 250 L320 230 M324 228 L330 244 L338 223" stroke-width="4" />
	{/if}

	<!-- Pikselek: arms behind the body -->
	{#if leftUp}
		<path d="M192 360 Q150 330 136 290" fill="none" stroke-width="16" stroke="#111" />
		<path d="M192 360 Q150 330 136 290" fill="none" stroke-width="6" stroke="#fff" />
		<circle cx="134" cy="282" r="15" />
	{:else}
		<path d="M190 400 Q160 420 154 452" fill="none" stroke-width="16" stroke="#111" />
		<path d="M190 400 Q160 420 154 452" fill="none" stroke-width="6" stroke="#fff" />
		<circle cx="152" cy="460" r="15" />
	{/if}
	{#if rightUp}
		<path d="M408 360 Q446 344 462 316" fill="none" stroke-width="16" stroke="#111" />
		<path d="M408 360 Q446 344 462 316" fill="none" stroke-width="6" stroke="#fff" />
		<circle cx="466" cy="310" r="15" />
	{:else}
		<path d="M410 400 Q440 420 446 452" fill="none" stroke-width="16" stroke="#111" />
		<path d="M410 400 Q440 420 446 452" fill="none" stroke-width="6" stroke="#fff" />
		<circle cx="448" cy="460" r="15" />
	{/if}

	<!-- Feet, body, the light and shade of his square, eyes, cheeks, smile -->
	<rect x="234" y="512" width="46" height="26" rx="13" />
	<rect x="320" y="512" width="46" height="26" rx="13" />
	<rect x="180" y="272" width="240" height="248" rx="54" />
	<path d="M206 340 V326 Q206 296 238 296 H266" fill="none" stroke-width="4" />
	<path d="M394 446 V468 Q394 494 366 494 H330" fill="none" stroke-width="4" />
	<circle cx="256" cy="360" r="32" />
	<circle cx="344" cy="360" r="32" />
	<circle cx="262" cy="365" r="15" fill="#111" stroke="none" />
	<circle cx="350" cy="365" r="15" fill="#111" stroke="none" />
	<circle cx="268" cy="358" r="5" fill="#fff" stroke="none" />
	<circle cx="356" cy="358" r="5" fill="#fff" stroke="none" />
	<ellipse cx="226" cy="414" rx="18" ry="11" stroke-width="4" />
	<ellipse cx="374" cy="414" rx="18" ry="11" stroke-width="4" />
	<path d="M260 424 Q300 462 340 424" fill="none" />
</svg>

<style>
	.coloring {
		display: block;
		width: 100%;
		height: auto;
		background: #fff;
	}
</style>
