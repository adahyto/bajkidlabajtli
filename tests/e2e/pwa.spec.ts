import { expect, test, type Page } from '@playwright/test';

// The site as an app (src/service-worker.ts, static/manifest.webmanifest, components/InstallApp.svelte)

/** Until the worker controls the page, what it loads is not kept: wait for it, then load once more */
async function underWorker(page: Page) {
	await page.waitForFunction(() => !!navigator.serviceWorker?.controller, null, {
		timeout: 15_000
	});
	await page.reload();
	await page.waitForLoadState('networkidle');
}

test('without the internet: the mode for a child with its pictures, the page for parents, /offline', async ({
	page,
	context
}) => {
	await page.goto('/dziecko');
	await underWorker(page);
	await context.setOffline(true);

	await page.reload();
	const songs = page.getByRole('list', { name: 'Piosenki', exact: true }).getByRole('button');
	await expect(songs).toHaveCount(4);
	await expect
		.poll(() =>
			page
				.locator('.tiles:not(.tiles--short) img')
				.evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).naturalWidth > 0).length)
		)
		.toBe(4);

	// Kept from the start, never opened
	await page.goto('/dla-rodzicow');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Piosenka, a potem rozmowa');

	// Never opened
	await page.goto('/piosenka/zlote-monetki');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nie ma internetu');

	// A song cannot play, and the player says why
	await page.goto('/dziecko');
	await page.getByRole('button', { name: 'Włącz: Gdy się zgubię' }).click();
	const stage = page.getByRole('dialog');
	await expect(stage.getByText('Nie ma internetu')).toBeVisible();
	await expect(stage.getByRole('link')).toHaveCount(0);
	await expect(stage.getByRole('button', { name: 'Spróbuj jeszcze raz' })).toBeVisible();
});

test('a page opened before is there without the internet', async ({ page, context }) => {
	await page.goto('/');
	await underWorker(page);
	await page.goto('/piosenka/klik-z-glowa');
	await context.setOffline(true);
	await page.reload();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Klik z głową');
});

test('the manifest: shortcuts and screenshots for installing', async ({ request }) => {
	const manifest = await (await request.get('/manifest.webmanifest')).json();
	expect(manifest.shortcuts.map((s: { url: string }) => s.url)).toEqual([
		'/dziecko',
		'/dla-rodzicow',
		'/#piosenki'
	]);
	expect(manifest.categories).toContain('kids');
	for (const shot of manifest.screenshots) {
		const res = await request.get(shot.src);
		expect(res.status(), shot.src).toBe(200);
		expect(res.headers()['content-type']).toBe('image/jpeg');
	}
	expect(manifest.screenshots.map((s: { form_factor: string }) => s.form_factor)).toEqual([
		'narrow',
		'narrow',
		'wide'
	]);
});

test('"Zainstaluj aplikację" only when the browser offers it', async ({ page }) => {
	await page.goto('/dla-rodzicow');
	const button = page.getByRole('button', { name: 'Zainstaluj aplikację' });
	await expect(page.getByRole('heading', { name: /Aplikacja na telefonie/ })).toBeVisible();
	await expect(button).toHaveCount(0);

	// What Chrome sends when the app can be installed
	await page.evaluate(() => {
		const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
			prompt: async () => {
				(window as unknown as { __prompted: boolean }).__prompted = true;
			},
			userChoice: Promise.resolve({ outcome: 'accepted' })
		});
		window.dispatchEvent(event);
	});
	await expect(button).toBeVisible();
	await button.click();
	await expect
		.poll(() => page.evaluate(() => (window as unknown as { __prompted?: boolean }).__prompted))
		.toBe(true);
	// Installed: no more button
	await expect(button).toHaveCount(0);
});

test.describe('on an iPhone', () => {
	test.use({
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1 Headless'
	});

	test('a how-to instead of the button', async ({ page }) => {
		await page.goto('/dla-rodzicow');
		await expect(page.getByText('Aplikacja na iPhonie i iPadzie:')).toBeVisible();
	});
});
