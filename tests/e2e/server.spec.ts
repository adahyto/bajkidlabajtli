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

test('the sitemap lists the songs with their videos, the playlist, not the shorts of a song', async ({
	request
}) => {
	const xml = await (await request.get('/sitemap.xml')).text();
	expect(xml).toContain('/piosenka/gdy-sie-zgubie</loc>');
	expect(xml).toContain('/piosenka/jeden-jeden-dwa</loc>');
	expect(xml).not.toContain('/krotka/stoj-jak-drzewo');
	expect(xml).not.toContain('/krotka/jeden-jeden-dwa');
	expect(xml).toContain('/playlista/bezpieczny-pikselek</loc>');
	expect(xml).toContain('/dla-rodzicow</loc>');
	expect(xml).not.toContain('/dziecko');
	expect(xml).toContain('/poradnik/co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie</loc><lastmod>');
	expect(xml).toContain('/poradnik/dobry-i-zly-sekret-jak-rozmawiac-z-dzieckiem</loc>');
	expect(xml).toContain('/poradnik/jak-zablokowac-zakupy-w-grach-na-telefonie-dziecka</loc>');
	expect(xml).toContain('/dla-przedszkoli/jeden-jeden-dwa</loc>');
	expect(xml).toContain('/kolorowanka/gdy-sie-zgubie</loc>');
	expect(xml.match(/<url>/g)).toHaveLength(37);
	// Google's video sitemap: one video for each song and the short of its own
	expect(xml.match(/<video:video>/g)).toHaveLength(8);
	expect(xml).toContain(
		'<video:player_loc>https://www.youtube-nocookie.com/embed/nvQ1vsDZJds</video:player_loc><video:duration>138</video:duration>'
	);
	expect(xml).toContain(
		'<video:title>Gdy się zgubię – Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie</video:title>'
	);
});

test('llms.txt tells AI assistants about the site and every song', async ({ request }) => {
	const res = await request.get('/llms.txt');
	expect(res.headers()['content-type']).toContain('text/plain');
	const text = await res.text();
	expect(text).toMatch(/^# Bajki dla Bajtli/);
	expect(text).toContain(
		'[Gdy się zgubię](http://127.0.0.1:4173/piosenka/gdy-sie-zgubie): Wesoła piosenka dla dzieci'
	);
	expect(text).toContain('Rules: Stój jak drzewo');
	expect(text).toContain('[Jeden, jeden, dwa](http://127.0.0.1:4173/piosenka/jeden-jeden-dwa)');
	expect(text).not.toContain('stoj-jak-drzewo');
	expect(text).toContain(
		'[Co zrobić, gdy dziecko zgubi się w sklepie?](http://127.0.0.1:4173/poradnik/co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie)'
	);
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
	expect(health.channel).toMatchObject({ source: 'fixture', videos: 16, playlists: 1 });
});

test('a page seen is counted, an unknown one is not an error', async ({ request }) => {
	for (const path of [
		'/piosenka/gdy-sie-zgubie',
		'/dla-rodzicow',
		'/dziecko',
		'/poradnik/co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie',
		'/dla-przedszkoli/zlote-monetki',
		'/kolorowanka/zlote-monetki',
		'/piosenka/nie-ma'
	]) {
		const res = await request.post('/api/stats', { data: { event: 'view', path } });
		expect(res.status()).toBe(204);
	}
});

test('the icons Google asks for are there, and the home page names the site in its description', async ({
	request
}) => {
	const ico = await request.get('/favicon.ico');
	expect(ico.status()).toBe(200);
	expect(ico.headers()['content-type']).toBe('image/x-icon');
	expect((await ico.body()).subarray(0, 4)).toEqual(Buffer.from([0, 0, 1, 0]));
	const html = await (await request.get('/')).text();
	expect(html).toContain('rel="icon" href="./favicon.ico" sizes="48x48"');
	expect(html).toMatch(/<meta name="description" content="Bajki dla Bajtli to /);
});
