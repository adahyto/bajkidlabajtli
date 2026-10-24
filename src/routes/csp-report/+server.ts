import type { RequestHandler } from './$types';

/*
 * Reports of the Content Security Policy (svelte.config.ts), sent by browsers: one line in the log of the
 * container, "CSP violation", with the page's path, the directive and what was blocked, nothing about the visitor
 * (as /prywatnosc says). Read them with: sudo docker compose logs --no-log-prefix nodeserver | grep 'CSP violation'
 */
const clip = (value: unknown) =>
	String(value ?? '')
		.slice(0, 300)
		.replace(/\s+/g, ' ');

export const POST: RequestHandler = async ({ request }) => {
	const text = (await request.text().catch(() => '')).slice(0, 10_000);
	try {
		const body = JSON.parse(text);
		// report-uri sends { "csp-report": {...} }; the Reporting API sends [{ type, body }]
		const reports = Array.isArray(body) ? body.map((r) => r?.body) : [body?.['csp-report']];
		for (const r of reports.filter(Boolean).slice(0, 10)) {
			let page = '';
			try {
				page = new URL(r['document-uri'] ?? r.documentURL).pathname;
			} catch {
				// not an address
			}
			console.log(
				`CSP violation ${clip(r['effective-directive'] ?? r.effectiveDirective ?? r['violated-directive'])} ` +
					`blocked=${clip(r['blocked-uri'] ?? r.blockedURL)} page=${clip(page)}`
			);
		}
	} catch {
		// not a report
	}
	return new Response(null, { status: 204 });
};
