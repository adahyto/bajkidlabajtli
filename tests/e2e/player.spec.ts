import { expect, test } from '@playwright/test';
import { fakeYouTube } from './youtube';

test.beforeEach(({ page }) => fakeYouTube(page));

test('the player starts on a click, from youtube-nocookie, and ends with our two buttons', async ({
	page
}) => {
	await page.goto('/piosenka/gdy-sie-zgubie');
	await expect(page.locator('iframe')).toHaveCount(0);
	await page.getByRole('button', { name: 'Włącz: Gdy się zgubię' }).click();
	await expect(page.locator('iframe')).toHaveCount(1);
	const created = await page.evaluate(
		() => (window as unknown as { __yt: { created: string[] } }).__yt.created
	);
	expect(created).toEqual(['https://www.youtube-nocookie.com/nvQ1vsDZJds']);
	// The words are in the picture: YouTube's captions start off
	const yt = () =>
		page.evaluate(
			() =>
				(window as unknown as { __yt: { vars: Record<string, unknown>; unloaded: string[] } }).__yt
		);
	expect((await yt()).vars.cc_load_policy).toBe(0);
	await expect.poll(async () => (await yt()).unloaded).toContain('captions');

	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await expect(page.getByText('Koniec! Co teraz?')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Jeszcze raz' })).toBeFocused();
	await page.getByRole('button', { name: 'Jeszcze raz' }).click();
	await expect(page.getByText('Koniec! Co teraz?')).toBeHidden();

	// "Następna" goes to the next song, and the open player plays it
	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await page
		.locator('.player')
		.getByRole('link', { name: /Następna/ })
		.click();
	await expect(page).not.toHaveURL(/gdy-sie-zgubie/);
	await expect
		.poll(() =>
			page.evaluate(() => (window as unknown as { __yt: { loaded: string[] } }).__yt.loaded.length)
		)
		.toBe(1);
});

test('a playlist plays one song after another', async ({ page }) => {
	await page.goto('/playlista/bezpieczny-pikselek');
	await expect(page.getByText('TERAZ 1 Z 4')).toBeVisible();
	await page.getByRole('button', { name: /^Włącz:/ }).click();
	await expect(page.locator('iframe')).toHaveCount(1);
	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await expect(page.getByText('TERAZ 2 Z 4')).toBeVisible();
	await page.getByRole('button', { name: /^4\./ }).click();
	await expect(page.getByText('TERAZ 4 Z 4')).toBeVisible();
	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await expect(page.getByRole('button', { name: 'Od początku' })).toBeVisible();
});
