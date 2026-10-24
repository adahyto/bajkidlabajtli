import { expect, test, type Page } from '@playwright/test';
import { fakeYouTube } from './youtube';

// The mode for a child (routes/dziecko), with YouTube's player replaced (tests/e2e/youtube.ts)

type Yt = { created: string[]; loaded: string[] };
const yt = (page: Page) => page.evaluate(() => (window as unknown as { __yt: Yt }).__yt);
const end = (page: Page) =>
	page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());

test.beforeEach(({ page }) => fakeYouTube(page));

test('a parent opens it from the home page; no menu, no footer, only the songs', async ({
	page
}) => {
	await page.goto('/');
	// "Tryb dla dziecka" on a computer, "Dla dziecka" on a phone
	await page
		.getByRole('banner')
		.getByRole('link', { name: /dla dziecka/i })
		.click();
	await expect(page).toHaveURL(/\/dziecko$/);
	await expect(page.getByRole('navigation', { name: 'Menu' })).toHaveCount(0);
	await expect(page.getByRole('contentinfo')).toHaveCount(0);
	await expect(
		page.getByRole('list', { name: 'Piosenki', exact: true }).getByRole('button')
	).toHaveCount(5);
	await expect(
		page.getByRole('list', { name: 'Krótkie piosenki' }).getByRole('button')
	).toHaveCount(5);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('a picture plays its song at once; the end asks "Jeszcze raz" or "Następna"', async ({
	page
}) => {
	await page.goto('/dziecko');
	const tile = page.getByRole('button', { name: 'Włącz: Gdy się zgubię' });
	await tile.click();
	const stage = page.getByRole('dialog', { name: 'Gdy się zgubię' });
	await expect(stage).toBeVisible();
	await expect(stage.getByRole('button', { name: 'Piosenki' })).toBeFocused();
	expect((await yt(page)).created).toEqual(['https://www.youtube-nocookie.com/nvQ1vsDZJds']);

	await end(page);
	await expect(stage.getByRole('button', { name: 'Jeszcze raz' })).toBeVisible();
	await stage.getByRole('button', { name: /^Następna/ }).click();
	await expect(page.getByRole('dialog', { name: 'Klik z głową' })).toBeVisible();
	expect((await yt(page)).loaded).toEqual(['ALro8KR2sZw']);

	await page.getByRole('button', { name: 'Piosenki' }).click();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(tile).toBeFocused();
});

test('"Wszystkie po kolei" plays the songs one after another', async ({ page }) => {
	await page.goto('/dziecko');
	await page.getByRole('button', { name: 'Wszystkie po kolei' }).click();
	const stage = page.getByRole('dialog');
	await expect(stage).toContainText('1 z 5');
	await end(page);
	await expect(stage).toContainText('2 z 5');
	await expect(stage.getByText('Koniec! Co teraz?')).toHaveCount(0);
});

test('a video that will not play offers to try again, not YouTube', async ({ page }) => {
	await page.goto('/dziecko');
	await page.getByRole('button', { name: 'Włącz: Klik z głową' }).click();
	await expect(page.locator('iframe')).toHaveCount(1);
	await page.evaluate(() => (window as unknown as { __ytError: () => void }).__ytError());
	const stage = page.getByRole('dialog');
	await expect(stage.getByText('Ten film nie chce się tu włączyć')).toBeVisible();
	await expect(stage.getByRole('link')).toHaveCount(0);
	await stage.getByRole('button', { name: 'Spróbuj jeszcze raz' }).click();
	await expect.poll(async () => (await yt(page)).created.length).toBe(2);
});

test('a short plays standing up', async ({ page }) => {
	await page.goto('/dziecko');
	await page.getByRole('button', { name: 'Włącz: Stój jak drzewo!' }).click();
	await expect(page.locator('.player--vertical')).toBeVisible();
});

test('"Wyjdź" leaves only when held for 3 seconds', async ({ page }) => {
	await page.goto('/dziecko');
	const exit = page.getByRole('button', { name: 'Wyjdź' });
	await exit.click();
	await exit.hover();
	await page.mouse.down();
	await page.waitForTimeout(1200);
	await page.mouse.up();
	await page.waitForTimeout(2500);
	await expect(page).toHaveURL(/\/dziecko$/);

	await exit.focus();
	await page.keyboard.down(' ');
	await page.waitForTimeout(3400);
	await page.keyboard.up(' ');
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('banner')).toBeVisible();
});

test('the icon on a phone opens the mode for a child', async ({ page, request }) => {
	const res = await request.get('/manifest.webmanifest');
	expect(res.status()).toBe(200);
	const manifest = await res.json();
	expect(manifest).toMatchObject({ start_url: '/dziecko', short_name: 'Bajki', scope: '/' });
	for (const icon of manifest.icons)
		expect((await request.get(icon.src)).headers()['content-type']).toBe('image/png');
	await page.goto('/');
	await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
		'href',
		/manifest\.webmanifest$/
	);
});

test('the bar is one row at every width and does not move when the page starts', async ({
	page
}) => {
	// "Cały ekran" is in the page from the server, hidden until the browser says it can
	const html = await (await page.request.get('/dziecko')).text();
	expect(html).toContain('Cały ekran');
	for (const width of [320, 375, 412, 600, 1024]) {
		await page.setViewportSize({ width, height: 800 });
		await page.goto('/dziecko');
		await expect(page.getByRole('button', { name: 'Cały ekran' })).toBeVisible();
		const [name, full] = await Promise.all(
			['.kid__name', '.kid__full'].map((s) => page.locator(s).boundingBox())
		);
		expect(
			Math.abs(name!.y + name!.height / 2 - (full!.y + full!.height / 2)),
			`${width}`
		).toBeLessThan(4);
	}
	const shift = await page.evaluate(
		() =>
			new Promise<number>((done) => {
				let sum = 0;
				new PerformanceObserver((list) => {
					for (const e of list.getEntries()) sum += (e as unknown as { value: number }).value;
				}).observe({ type: 'layout-shift', buffered: true });
				setTimeout(() => done(sum), 300);
			})
	);
	expect(shift).toBeLessThan(0.05);
});
