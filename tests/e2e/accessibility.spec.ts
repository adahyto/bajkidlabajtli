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
	'/dla-rodzicow',
	'/dziecko',
	'/offline',
	'/poradnik',
	'/poradnik/co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie',
	'/poradnik/dobry-i-zly-sekret-jak-rozmawiac-z-dzieckiem',
	'/poradnik/jak-zablokowac-zakupy-w-grach-na-telefonie-dziecka',
	'/poradnik/jak-nauczyc-dziecko-dzwonic-pod-112',
	'/poradnik/bezpieczny-internet-dla-przedszkolaka',
	'/dla-przedszkoli',
	'/dla-przedszkoli/niespodzianka-tak-sekret-nie',
	'/kolorowanka/zlote-monetki',
	'/prywatnosc',
	'/nie-ma-takiej-strony'
]) {
	test(`accessible: ${path}`, async ({ page }) => {
		await page.goto(path);
		await check(page);
	});
}

test('accessible: a song playing in the mode for a child', async ({ page }) => {
	await fakeYouTube(page);
	await page.goto('/dziecko');
	await page.getByRole('button', { name: 'Włącz: Gdy się zgubię' }).click();
	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await expect(page.getByText('Koniec! Co teraz?')).toBeVisible();
	await check(page);
});

test('accessible: the end screen of the player', async ({ page }) => {
	await fakeYouTube(page);
	await page.goto('/piosenka/gdy-sie-zgubie');
	await page.getByRole('button', { name: 'Włącz: Gdy się zgubię' }).click();
	await page.evaluate(() => (window as unknown as { __ytEnd: () => void }).__ytEnd());
	await expect(page.getByText('Koniec! Co teraz?')).toBeVisible();
	await check(page);
});

// 44 × 44 px to tap (WCAG 2.5.5) for everything but links inside running text; a small chip counts the space
// its ::after takes the tap in
test('everything to tap is at least 44 px', async ({ page }) => {
	for (const path of [
		'/',
		'/piosenka/jeden-jeden-dwa',
		'/krotka/stoj-jak-drzewo',
		'/playlista/bezpieczny-pikselek',
		'/dla-rodzicow',
		'/dziecko',
		'/poradnik/jak-nauczyc-dziecko-dzwonic-pod-112',
		'/dla-przedszkoli',
		'/dla-przedszkoli/zlote-monetki',
		'/kolorowanka/zlote-monetki'
	]) {
		await page.goto(path);
		const small = await page.evaluate(() =>
			[
				...document.querySelectorAll<HTMLElement>(
					'a[href], button, input, select, summary, [role=button]'
				)
			].flatMap((el) => {
				const style = getComputedStyle(el);
				if (style.visibility === 'hidden' || el.closest('.visually-hidden, [inert]')) return [];
				if (style.display === 'inline' && el.closest('p, li, td, dd, small')) return [];
				const box = el.getBoundingClientRect();
				if (!box.width || !box.height) return [];
				const after = getComputedStyle(el, '::after');
				const grow = (side: string) =>
					after.content !== 'none' && after.position === 'absolute'
						? Math.max(0, -parseFloat(after.getPropertyValue(side)) || 0)
						: 0;
				const width = box.width + grow('left') + grow('right');
				const height = box.height + grow('top') + grow('bottom');
				return width >= 44 && height >= 44
					? []
					: [`${el.textContent?.trim().slice(0, 30)} ${Math.round(width)}×${Math.round(height)}`];
			})
		);
		expect(small, path).toEqual([]);
	}
});
