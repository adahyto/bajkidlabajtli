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

test('the privacy page names who is responsible', async ({ page }) => {
	await page.goto('/prywatnosc');
	await expect(page.getByText('Administratorem danych jest Adam Tomaś')).toBeVisible();
});
