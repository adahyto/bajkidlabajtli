/**
 * Tells the server of a page seen, for the statistics without cookies (lib/server/stats.ts): only the page's
 * path, without what follows ? or #, nothing about the visitor and nothing kept in the browser. The server does
 * not count the pages it sends, as Cloudflare answers for most of them (hooks.server.ts). Never holds the page up
 * and never fails it.
 */
export function trackView(path: string, entry?: { from: string; utm: string }): void {
	try {
		const body = JSON.stringify({ event: 'view', path, ...entry });
		const sent =
			typeof navigator.sendBeacon === 'function' &&
			navigator.sendBeacon('/api/stats', new Blob([body], { type: 'application/json' }));
		if (!sent) {
			fetch('/api/stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body,
				keepalive: true
			}).catch(() => {});
		}
	} catch {
		// statistics are never worth an error
	}
}

/**
 * The first page of a visit: also where it came from, which the server keeps only as a kind (a search engine,
 * an AI assistant…): the host of the referring site, never the rest of its address, and the utm_source some
 * assistants add. A page the browser prepared before it was opened counts when it is shown.
 */
export function trackEntry(url: URL): void {
	const send = () => {
		let from = '';
		try {
			from = document.referrer ? new URL(document.referrer).hostname : '';
		} catch {
			// no address, no source
		}
		trackView(url.pathname, { from, utm: url.searchParams.get('utm_source') ?? '' });
	};
	if ((document as Document & { prerendering?: boolean }).prerendering)
		document.addEventListener('prerenderingchange', send, { once: true });
	else send();
}
