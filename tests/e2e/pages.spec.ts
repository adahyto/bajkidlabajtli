import { expect, test } from '@playwright/test';

test('the home page shows the songs, shorts, playlist and the part for parents', async ({
	page
}) => {
	const outside: string[] = [];
	page.on('request', (r) => {
		if (!r.url().startsWith('http://127.0.0.1')) outside.push(r.url());
	});
	await page.goto('/');
	await expect(page).toHaveTitle(/Bajki dla Bajtli/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Śpiewaj z Pikselkiem!');
	const songs = page.locator('#piosenki a.card');
	await expect(songs).toHaveCount(4);
	await expect(songs.first()).toContainText('Niespodzianka tak, sekret nie');
	await expect(songs.first()).toContainText('2:29');
	await expect(page.locator('#krotkie a.card')).toHaveCount(5);
	await expect(page.locator('#playlisty')).toContainText('Bezpieczny Pikselek');
	await expect(page.locator('#playlisty')).toContainText('4 PIOSENKI');
	await expect(page.locator('#rodzice tbody tr')).toHaveCount(4);
	// Before a video is played, nothing but this site
	await page.mouse.wheel(0, 5000);
	await page.waitForLoadState('networkidle');
	expect(outside).toEqual([]);
	// Nothing wider than the screen
	const wide = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
	expect(wide).toBe(false);
});

test('a song: rules and questions for parents, the short, the next song', async ({ page }) => {
	await page.goto('/piosenka/gdy-sie-zgubie');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gdy się zgubię');
	await expect(page).toHaveTitle('Gdy się zgubię — piosenka | Bajki dla Bajtli');
	const parents = page.getByRole('region', { name: 'Dla rodziców' });
	await expect(parents).toContainText('Stój jak drzewo – zostań w miejscu, nie szukaj sam.');
	await expect(parents).toContainText('Kogo w sklepie możesz poprosić o pomoc?');
	await expect(parents).toContainText('Przećwiczcie te zasady');
	await expect(page.getByRole('link', { name: /KRÓTKA WERSJA/ })).toHaveAttribute(
		'href',
		'/krotka/stoj-jak-drzewo'
	);
	await page.getByRole('link', { name: /Następna/ }).click();
	await expect(page).toHaveURL(/\/piosenka\/[a-z-]+$/);
	await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Gdy się zgubię');
});

test('a song with phone numbers for help', async ({ page }) => {
	await page.goto('/piosenka/niespodzianka-tak-sekret-nie');
	await expect(page.getByText('116 111 – Telefon Zaufania')).toBeVisible();
});

test('a short leads to its full song', async ({ page }) => {
	await page.goto('/krotka/stoj-jak-drzewo');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stój jak drzewo!');
	await page.getByRole('link', { name: /CAŁA PIOSENKA/ }).click();
	await expect(page).toHaveURL(/\/piosenka\/gdy-sie-zgubie$/);
});

test('an unknown song is a friendly 404', async ({ page }) => {
	const res = await page.goto('/piosenka/nie-ma-takiej');
	expect(res?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ups! Tu nic nie ma.');
	await page.getByRole('link', { name: 'Wszystkie piosenki' }).click();
	await expect(page).toHaveURL(/\/$/);
});

test('for parents: every song with its rules and questions, the numbers for help once', async ({
	page
}) => {
	await page.goto('/');
	await page
		.getByRole('navigation', { name: 'Menu' })
		.getByRole('link', { name: 'Dla rodziców' })
		.click();
	await expect(page).toHaveURL(/\/dla-rodzicow$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Piosenka, a potem rozmowa');
	await expect(page.locator('article.song')).toHaveCount(4);
	const song = page.getByRole('article', { name: 'Gdy się zgubię' });
	await expect(song).toContainText('Stój jak drzewo – zostań w miejscu, nie szukaj sam.');
	await expect(song).toContainText('Kogo w sklepie możesz poprosić o pomoc?');
	await expect(song).toContainText('Przećwiczcie te zasady');
	await expect(page.getByText('116 111 – Telefon Zaufania')).toHaveCount(1);
	await page
		.getByRole('navigation', { name: 'Piosenki na tej stronie' })
		.getByRole('link', { name: 'Złote monetki' })
		.click();
	await expect(page).toHaveURL(/#zlote-monetki$/);
	await song.getByRole('link', { name: /Włącz piosenkę/ }).click();
	await expect(page).toHaveURL(/\/piosenka\/gdy-sie-zgubie$/);
});

test('for parents, printed: rules and questions, no menu or buttons', async ({ page }) => {
	await page.goto('/dla-rodzicow');
	await page.emulateMedia({ media: 'print' });
	await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden();
	await expect(page.getByRole('button', { name: /Wydrukuj/ })).toBeHidden();
	await expect(page.getByRole('heading', { name: 'Jak strona chroni dziecko' })).toBeHidden();
	await expect(page.getByRole('heading', { name: 'Zasady z piosenki' }).first()).toBeVisible();
	await expect(
		page.getByRole('heading', { name: 'Porozmawiajcie po piosence' }).first()
	).toBeVisible();
});

test('search engines read the video on a song page and the channel on the home page', async ({
	page
}) => {
	const reports: string[] = [];
	page.on('console', (m) => m.type() === 'error' && reports.push(m.text()));
	const read = async () =>
		JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '');
	await page.goto('/piosenka/gdy-sie-zgubie');
	const video = await read();
	expect(video).toMatchObject({
		'@type': 'VideoObject',
		duration: 'PT2M18S',
		embedUrl: 'https://www.youtube-nocookie.com/embed/nvQ1vsDZJds',
		url: 'http://127.0.0.1:4173/piosenka/gdy-sie-zgubie',
		uploadDate: '2026-10-21T13:00:05Z'
	});
	expect(video.description).toMatch(/^Piosenka dla dzieci: co robić/);
	await page.goto('/playlista/bezpieczny-pikselek');
	expect((await read()).itemListElement).toHaveLength(4);
	await page.goto('/');
	expect((await read())['@graph'][1].sameAs).toEqual(['https://www.youtube.com/@BajkiDlaBajtli']);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'http://127.0.0.1:4173/udostepnij.png'
	);
	// The content security policy lets the JSON be
	expect(reports).toEqual([]);
});

test('the privacy page names who is responsible', async ({ page }) => {
	await page.goto('/prywatnosc');
	await expect(page.getByText('Administratorem danych jest Adam Tomaś')).toBeVisible();
});
