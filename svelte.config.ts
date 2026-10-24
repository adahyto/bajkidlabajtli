// svelte.config.js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// Content Security Policy, enforced from the start: everything the pages load comes from this site, but the
		// YouTube player, only after a click (lib/components/Player.svelte): its script from www.youtube.com and the
		// frame from www.youtube-nocookie.com. No inline scripts but SvelteKit's own start-up script (by its hash, not
		// a nonce: a page is the same for everyone, so Cloudflare may keep it, see hooks.server.ts) and no <style>
		// elements. Style attributes are allowed: SvelteKit's route announcer (the hidden "page changed" message for
		// screen readers) has one.
		// Browsers report what it blocks to src/routes/csp-report.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://www.youtube.com'],
				'style-src': ['self'],
				'style-src-elem': ['self'],
				'style-src-attr': ['unsafe-inline'],
				'img-src': ['self', 'data:'],
				'font-src': ['self'],
				'connect-src': ['self'],
				'manifest-src': ['self'],
				'frame-src': ['https://www.youtube-nocookie.com'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none'],
				'report-uri': ['/csp-report']
			}
		}
	}
};

export default config;
