import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isoDuration, ldScript, playlistLd, siteLd, videoLd } from '../../src/lib/jsonld.ts';

const ORIGIN = 'https://bajkidlabajtli.pl';

test('lengths as ISO 8601', () => {
	assert.equal(isoDuration(149), 'PT2M29S');
	assert.equal(isoDuration(18), 'PT18S');
	assert.equal(isoDuration(120), 'PT2M');
	assert.equal(isoDuration(3723), 'PT1H2M3S');
	assert.equal(isoDuration(0), 'PT0S');
});

test('a song is a video with whole addresses', () => {
	const ld = videoLd(
		ORIGIN,
		{
			id: 'nvQ1vsDZJds',
			title: 'Gdy się zgubię',
			subtitle: 'Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie',
			slug: 'gdy-sie-zgubie',
			seconds: 138,
			short: false,
			topic: 'W sklepie',
			fullTitle:
				'Pikselek - Gdy się zgubię 🌳 Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie',
			published: '2026-10-21T13:00:05Z'
		},
		'Wesoła piosenka dla dzieci',
		'/piosenka/gdy-sie-zgubie'
	);
	assert.equal(ld['@type'], 'VideoObject');
	assert.equal(
		ld.name,
		'Gdy się zgubię – Piosenka dla dzieci: co robić, gdy zgubisz się w sklepie'
	);
	assert.equal(ld.description, 'Wesoła piosenka dla dzieci');
	assert.deepEqual(ld.thumbnailUrl, [
		`${ORIGIN}/miniatura/nvQ1vsDZJds-l.jpg`,
		`${ORIGIN}/miniatura/nvQ1vsDZJds-m.jpg`
	]);
	assert.equal(ld.uploadDate, '2026-10-21T13:00:05Z');
	assert.equal(ld.duration, 'PT2M18S');
	assert.equal(ld.embedUrl, 'https://www.youtube-nocookie.com/embed/nvQ1vsDZJds');
	assert.equal(ld.url, `${ORIGIN}/piosenka/gdy-sie-zgubie`);
});

test('a video from RSS has no length', () => {
	const ld = videoLd(
		ORIGIN,
		{
			id: 'aaaaaaaaaaa',
			title: 'A',
			subtitle: '',
			slug: 'a',
			seconds: 0,
			short: true,
			topic: '',
			fullTitle: 'A #shorts',
			published: '2026-10-21T13:00:05Z'
		},
		'',
		'/krotka/a'
	);
	assert.equal(ld.name, 'A');
	assert.equal(ld.description, 'A #shorts');
	assert.ok(!('duration' in ld));
	assert.equal((ld.thumbnailUrl as string[])[0], `${ORIGIN}/miniatura/aaaaaaaaaaa-s.jpg`);
});

test('a playlist lists its songs in order; the home page names the channel', () => {
	const list = playlistLd(ORIGIN, 'Bezpieczny Pikselek', [
		{ title: 'Klik z głową', path: '/piosenka/klik-z-glowa' },
		{ title: 'Gdy się zgubię', path: '/piosenka/gdy-sie-zgubie' }
	]);
	assert.equal(list.numberOfItems, 2);
	assert.deepEqual((list.itemListElement as Record<string, unknown>[])[1], {
		'@type': 'ListItem',
		position: 2,
		name: 'Gdy się zgubię',
		url: `${ORIGIN}/piosenka/gdy-sie-zgubie`
	});
	const graph = siteLd(ORIGIN)['@graph'] as Record<string, unknown>[];
	assert.deepEqual(
		graph.map((n) => n['@type']),
		['WebSite', 'Organization']
	);
	assert.deepEqual(graph[1].sameAs, ['https://www.youtube.com/@BajkiDlaBajtli']);
});

test('a title cannot end the script element', () => {
	const html = ldScript({ name: 'A</script><script>alert(1)</script>' });
	assert.equal(html.match(/<\/script>/g)?.length, 1);
	assert.ok(html.includes('\\u003c/script>'));
});
