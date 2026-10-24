/*
 * Installing the app (static/manifest.webmanifest): Chrome, Edge and Android offer it by an event, which the layout
 * keeps here (routes/+layout.svelte) for the button (components/InstallApp.svelte) to use later. Safari has no such
 * event: on an iPhone or iPad the button is a short how-to instead.
 */

type InstallEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: string }>;
};

export const install = $state<{ event: InstallEvent | null; installed: boolean }>({
	event: null,
	installed: false
});

export function keepInstallEvent(e: Event) {
	// The browser's own small banner stays away; the button on the page offers it instead
	e.preventDefault();
	install.event = e as InstallEvent;
}

export function installed() {
	install.event = null;
	install.installed = true;
}

/** Opened from the icon on the home screen, not in a browser's tab */
export const runsAsApp = () =>
	matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches ||
	(navigator as Navigator & { standalone?: boolean }).standalone === true;

/** Safari on an iPhone or iPad (an iPad says it is a Mac, but has a touch screen) */
export const isApple = () =>
	/iPhone|iPad|iPod/.test(navigator.userAgent) ||
	(/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
