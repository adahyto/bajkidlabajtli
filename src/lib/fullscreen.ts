/*
 * The whole screen for the mode for a child (routes/dziecko), where the browser can: not on an iPhone, where the
 * icon on the home screen (static/manifest.webmanifest) does it instead. A page change inside the site keeps it.
 */

export const canFullscreen = () =>
	typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;

export const isFullscreen = () => typeof document !== 'undefined' && !!document.fullscreenElement;

/** From a click only (browsers allow it then); a refusal leaves the page as it was */
export function enterFullscreen() {
	if (canFullscreen() && !isFullscreen())
		document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
}

export function exitFullscreen() {
	if (isFullscreen()) document.exitFullscreen().catch(() => {});
}
