import type { Page } from '@playwright/test';

/**
 * YouTube's IFrame API, replaced before the page loads (components/Player.svelte uses window.YT when it is there):
 * a frame that plays at once and ends when the test calls window.__ytEnd() (fails: __ytError()). window.__yt tells what was asked of it
 * (the videos, the player's settings, the modules unloaded: captions).
 * Requests to YouTube itself are cut off, so a test never depends on it.
 */
export async function fakeYouTube(page: Page) {
	await page.route(/youtube(-nocookie)?\.com|ytimg\.com|googlevideo\.com/, (route) =>
		route.abort()
	);
	await page.addInitScript(() => {
		const w = window as unknown as Record<string, unknown>;
		const yt = {
			created: [] as string[],
			loaded: [] as string[],
			unloaded: [] as string[],
			vars: {} as Record<string, unknown>,
			seeked: 0
		};
		w.__yt = yt;
		w.YT = {
			PlayerState: { ENDED: 0, PLAYING: 1 },
			Player: class {
				constructor(
					target: HTMLElement,
					options: {
						videoId: string;
						host: string;
						playerVars: Record<string, unknown>;
						events: { onStateChange: (e: { data: number }) => void; onError: () => void };
					}
				) {
					yt.created.push(`${options.host}/${options.videoId}`);
					yt.vars = options.playerVars;
					const frame = document.createElement('iframe');
					frame.title = 'YouTube';
					target.replaceWith(frame);
					setTimeout(() => options.events.onStateChange({ data: 1 }), 20);
					w.__ytEnd = () => options.events.onStateChange({ data: 0 });
					w.__ytError = () => options.events.onError();
				}
				loadVideoById(id: string) {
					yt.loaded.push(id);
				}
				unloadModule(name: string) {
					yt.unloaded.push(name);
				}
				seekTo() {
					yt.seeked++;
				}
				playVideo() {}
				destroy() {}
			}
		};
	});
}
