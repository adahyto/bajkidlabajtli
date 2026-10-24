import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { fakeYouTube } from './youtube';

// WCAG 2.2 AA (and axe's best practices) on every kind of page, also with the end screen of the player

const check = async (page: import('@playwright/test').Page) => {
	const { violations } = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
		.analyze();
	expect(
		violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
	).toEqual([]);
};

for (const path of [
	'/',
	'/piosenka/gdy-sie-zgubie',
	'/piosenka/niespodzianka-tak-sekret-nie',
	'/krotka/stoj-jak-drzewo',
	'/playlista/bezpieczny-pikselek',
	'/prywatnosc',
	'/nie-ma-takiej-strony'
]) {
	test(`accessible: ${path}`, async ({ page }) => {
		await page.goto(path);
		await check(page);
	});
}

test('accessible: the end screen of the player', async ({ page }) => {
	await fakeYouTube(page);
	await page.goto('/piosenka/gdy-sie-zgubie');
	await page.getByRole('button', { name: 'Włącz: Gdy się zgubię' }).click();
	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await expect(page.getByText('Koniec! Co teraz?')).toBeVisible();
	await check(page);
});
