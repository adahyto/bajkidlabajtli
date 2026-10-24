import { expect, test } from '@playwright/test';

test('until launch: robots.txt and the header keep search engines out', async ({ request }) => {
	const robots = await request.get('/robots.txt');
	expect(await robots.text()).toContain('Disallow: /');
	// Cloudflare may keep it five minutes, not hours: the launch shows soon
	expect(robots.headers()['cache-control']).toBe('public, max-age=300');
	expect((await request.get('/sitemap.xml')).headers()['cache-control']).toBe(
		'public, max-age=300'
	);
	expect((await request.get('/')).headers()['x-robots-tag']).toBe('noindex');
});

test('the sitemap lists the songs, shorts and playlist', async ({ request }) => {
	const xml = await (await request.get('/sitemap.xml')).text();
	expect(xml).toContain('/piosenka/gdy-sie-zgubie</loc>');
	expect(xml).toContain('/krotka/stoj-jak-drzewo</loc>');
	expect(xml).toContain('/playlista/bezpieczny-pikselek</loc>');
	expect(xml).toContain('/dla-rodzicow</loc>');
	expect(xml).not.toContain('/dziecko');
	expect(xml.match(/<url>/g)).toHaveLength(13);
});

test('the IndexNow key is served as plain text', async ({ request }) => {
	const res = await request.get('/41105b3b4a3cc4831930e468c4056496.txt');
	expect(res.status()).toBe(200);
	expect(await res.text()).toBe('41105b3b4a3cc4831930e468c4056496');
});

test('pictures only of the channel’s videos', async ({ request }) => {
	expect((await request.get('/miniatura/aaaaaaaaaaa-m.jpg')).status()).toBe(404);
	expect((await request.get('/miniatura/nvQ1vsDZJds-x.jpg')).status()).toBe(404);
});

test('the content security policy lets YouTube in only as a frame and its script', async ({
	request
}) => {
	const csp = (await request.get('/')).headers()['content-security-policy'];
	expect(csp).toContain('frame-src https://www.youtube-nocookie.com');
	expect(csp).toMatch(/script-src 'self' https:\/\/www\.youtube\.com/);
});

test('health tells where the songs come from', async ({ request }) => {
	const health = await (await request.get('/health')).json();
	expect(health.status).toBe('ok');
	expect(health.channel).toMatchObject({ source: 'fixture', videos: 9, playlists: 1 });
});

test('a page seen is counted, an unknown one is not an error', async ({ request }) => {
	for (const path of [
		'/piosenka/gdy-sie-zgubie',
		'/dla-rodzicow',
		'/dziecko',
		'/piosenka/nie-ma'
	]) {
		const res = await request.post('/api/stats', { data: { event: 'view', path } });
		expect(res.status()).toBe(204);
	}
});
