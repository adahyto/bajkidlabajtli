<script lang="ts">
	import { onDestroy } from 'svelte';

	/*
	 * A button that acts only when held (`ms`, 3 s): for grown-ups, so that a child's tap does not leave the mode
	 * for a child (routes/dziecko). A ring fills while it is held; letting go earlier does nothing. A finger, a mouse,
	 * Enter or Space; a long touch does not open the phone's menu.
	 */
	let { label, ms = 3000, onhold }: { label: string; ms?: number; onhold: () => void } = $props();

	let progress = $state(0);
	let started = 0;
	let frame = 0;

	function tick(now: number) {
		progress = Math.min(1, (now - started) / ms);
		if (progress >= 1) {
			stop();
			onhold();
		} else frame = requestAnimationFrame(tick);
	}

	function begin() {
		if (frame) return;
		started = performance.now();
		frame = requestAnimationFrame(tick);
	}

	function stop() {
		// Also when the page is made on the server (onDestroy), where there are no frames
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		progress = 0;
	}

	const key = (e: KeyboardEvent) => e.key === 'Enter' || e.key === ' ';

	onDestroy(stop);
</script>

<button
	type="button"
	class="hold"
	aria-describedby="hold-hint"
	onpointerdown={(e) => {
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		begin();
	}}
	onpointerup={stop}
	onpointercancel={stop}
	onlostpointercapture={stop}
	onkeydown={(e) => {
		if (!key(e)) return;
		e.preventDefault();
		if (!e.repeat) begin();
	}}
	onkeyup={(e) => key(e) && stop()}
	onblur={stop}
	oncontextmenu={(e) => e.preventDefault()}
	onclick={(e) => e.preventDefault()}
>
	<svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
		<circle cx="18" cy="18" r="15" class="hold__track" />
		<circle
			cx="18"
			cy="18"
			r="15"
			class="hold__fill"
			pathLength="100"
			style:stroke-dashoffset={100 - progress * 100}
			style:opacity={progress ? 1 : 0}
		/>
	</svg>
	<span>{label}</span>
</button>
<span id="hold-hint" class="visually-hidden">Przytrzymaj 3 sekundy</span>

<style>
	.hold {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 52px;
		padding: 8px 18px 8px 10px;
		border: 0;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.85);
		color: var(--ink);
		font:
			800 16px/1.2 'Nunito',
			system-ui,
			sans-serif;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		touch-action: none;
	}

	.hold svg {
		flex: none;
		transform: rotate(-90deg);
	}

	circle {
		fill: none;
		stroke-width: 5;
	}

	.hold__track {
		stroke: var(--line);
	}

	.hold__fill {
		stroke: var(--blue);
		stroke-dasharray: 100;
		stroke-linecap: round;
	}
</style>
