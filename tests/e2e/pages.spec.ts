import { expect, test, type Page } from '@playwright/test';

// The menu, opened first on a phone, where it hides behind the "Menu" button
const menu = async (page: Page) => {
	const toggle = page.getByRole('button', { name: 'Menu' });
	if (await toggle.isVisible()) await toggle.click();
	return page.getByRole('navigation', { name: 'Menu' });
};

test('the home page shows the songs, shorts, playlist and the part for parents', async ({
	page
}) => {
	const outside: string[] = [];
	page.on('request', (r) => {
		if (!r.url().startsWith('http://127.0.0.1')) outside.push(r.url());
	});
	await page.goto('/');
	await expect(page).toHaveTitle(/Bajki dla Bajtli/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Śpiewaj z Pikselkiem! Piosenki dla dzieci o bezpieczeństwie'
	);
	const songs = page.locator('#piosenki a.card');
	await expect(songs).toHaveCount(5);
	await expect(songs.first()).toContainText('Jeden, jeden, dwa');
	await expect(songs.first()).toContainText('2:20');
	await expect(page.locator('#krotkie a.card')).toHaveCount(5);
	await expect(page.locator('#playlisty')).toContainText('Bezpieczny Pikselek');
	await expect(page.locator('#playlisty')).toContainText('4 PIOSENKI');
	// The newest song on its picture, three ways in under it
	await expect(
		page.getByRole('link', {
			name: /^Włącz: (Nowa|Najnowsza) piosenka: Jeden, jeden, dwa/
		})
	).toBeVisible();
	const paths = page.getByRole('list', { name: 'Dla kogo' }).getByRole('link');
	await expect(paths).toHaveCount(3);
	await expect(paths.nth(0)).toHaveAttribute('href', '/dziecko');
	await expect(paths.nth(1)).toHaveAttribute('href', '/dla-rodzicow');
	await expect(paths.nth(2)).toHaveAttribute('href', '/dla-przedszkoli');
	await expect(page.getByRole('list', { name: 'Jak strona chroni dziecko' })).toContainText(
		'YouTube dopiero po kliknięciu'
	);
	// Every short names its song, also when its title is the song's (cards alike)
	const shorts = page.getByRole('list', { name: 'Krótkie piosenki' });
	await expect(shorts.getByRole('link', { name: /Dzyń, dzyń, dzyń!/ })).toContainText(
		'z piosenki: Złote monetki'
	);
	await expect(shorts.getByText('z piosenki: Niespodzianka tak, sekret nie')).toHaveCount(1);
	await expect(shorts.getByText(/^z piosenki: /)).toHaveCount(
		await shorts.getByRole('link').count()
	);
	await expect(
		page.locator('#playlisty').getByRole('link', { name: 'Wszystkie po kolei' })
	).toBeVisible();
	// For parents only a short way in, the rest on their page
	const parents = page.getByRole('region', { name: 'Dla rodziców' });
	await expect(parents.getByRole('listitem')).toHaveCount(3);
	await expect(parents.getByRole('link', { name: 'Zasady i pytania do rozmowy' })).toHaveAttribute(
		'href',
		'/dla-rodzicow'
	);
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
	// What parents search for, not only the song's name
	await expect(page).toHaveTitle(
		'Gdy się zgubię – piosenka dla dzieci: co robić, gdy zgubisz się w sklepie'
	);
	const description = await page.locator('meta[name="description"]').getAttribute('content');
	expect(description).toBe(
		'Wesoła piosenka dla dzieci o tym, co zrobić, gdy zgubimy się mamie i tacie! Z zasadami i pytaniami do rozmowy dla rodziców.'
	);
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
	// The other shorts below name their songs, as on the home page
	await expect(
		page
			.getByRole('region', { name: 'Inne krótkie piosenki' })
			.getByText('z piosenki: Złote monetki')
	).toBeVisible();
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
	await (await menu(page)).getByRole('link', { name: 'Dla rodziców' }).click();
	await expect(page).toHaveURL(/\/dla-rodzicow$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Piosenka, a potem rozmowa');
	await expect(page.locator('article.song')).toHaveCount(5);
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
	// The blocks of a page by their type (@graph: the home page's)
	const read = async (type: string) => {
		const blocks = await page
			.locator('script[type="application/ld+json"]')
			.evaluateAll((all) => all.map((s) => JSON.parse(s.textContent ?? '')));
		return blocks.find((b) => b['@type'] === type || (type === '@graph' && b['@graph']));
	};
	await page.goto('/piosenka/gdy-sie-zgubie');
	const video = await read('VideoObject');
	expect(video).toMatchObject({
		'@type': 'VideoObject',
		duration: 'PT2M18S',
		embedUrl: 'https://www.youtube-nocookie.com/embed/nvQ1vsDZJds',
		url: 'http://127.0.0.1:4173/piosenka/gdy-sie-zgubie',
		uploadDate: '2026-10-21T13:00:05Z'
	});
	expect(video.description).toMatch(/^Piosenka dla dzieci: co robić/);
	expect(video.audience).toMatchObject({ suggestedMinAge: 3, suggestedMaxAge: 8 });
	expect((await read('BreadcrumbList')).itemListElement[1]).toMatchObject({
		name: 'Gdy się zgubię',
		item: 'http://127.0.0.1:4173/piosenka/gdy-sie-zgubie'
	});
	await page.goto('/playlista/bezpieczny-pikselek');
	expect((await read('ItemList')).itemListElement).toHaveLength(4);
	await page.goto('/');
	expect((await read('@graph'))['@graph'][1].sameAs).toEqual([
		'https://www.youtube.com/@BajkiDlaBajtli'
	]);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'http://127.0.0.1:4173/udostepnij.png'
	);
	// The content security policy lets the JSON be
	expect(reports).toEqual([]);
});

test('the first song of a list has no "Poprzednia", after the last it starts again', async ({
	page
}) => {
	// The playlist's order: Niespodzianka tak, sekret nie … Klik z głową
	await page.goto('/piosenka/niespodzianka-tak-sekret-nie');
	const steps = page.getByRole('navigation', { name: 'Inne piosenki po kolei' });
	await expect(steps.getByRole('link')).toHaveCount(1);
	await expect(steps.getByRole('link')).toContainText('Następna');
	await page.goto('/piosenka/klik-z-glowa');
	await expect(steps.getByRole('link', { name: /Poprzednia/ })).toContainText('Gdy się zgubię');
	await expect(steps.getByRole('link', { name: /Od początku/ })).toContainText(
		'Niespodzianka tak, sekret nie'
	);
	// The playlist: one way to the rules for parents, under the list
	await page.goto('/playlista/bezpieczny-pikselek');
	await expect(
		page.getByRole('main').getByRole('link', { name: 'Dla rodziców', exact: true })
	).toHaveCount(1);
	await expect(
		page.getByRole('list', { name: 'Piosenki na playliście' }).getByRole('link')
	).toHaveCount(0);
});

test('for parents: the names of the songs stay at the top while scrolling', async ({ page }) => {
	await page.goto('/dla-rodzicow');
	const bar = page.getByRole('navigation', { name: 'Piosenki na tej stronie' });
	await bar.getByRole('link', { name: 'Klik z głową' }).click();
	await expect(page).toHaveURL(/#klik-z-glowa$/);
	await expect.poll(async () => (await bar.boundingBox())?.y).toBe(0);
	// The song's name is not under the bar
	const bottom = (await bar.boundingBox())!.height;
	expect(
		(await page.getByRole('article', { name: 'Klik z głową' }).boundingBox())!.y
	).toBeGreaterThanOrEqual(bottom);
});

test('a short with its full song on the channel points search engines to the song', async ({
	page
}) => {
	await page.goto('/krotka/stoj-jak-drzewo');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'http://127.0.0.1:4173/piosenka/gdy-sie-zgubie'
	);
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
	// Found by its title when its description does not link the song
	await page.goto('/krotka/jeden-jeden-dwa');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'http://127.0.0.1:4173/piosenka/jeden-jeden-dwa'
	);
});

test('every page has a description that fits in search results', async ({ page, request }) => {
	const xml = await (await request.get('/sitemap.xml')).text();
	const paths = [...xml.matchAll(/<loc>http:\/\/127\.0\.0\.1:4173([^<]*)<\/loc>/g)].map(
		(m) => m[1]
	);
	expect(paths.length).toBe(26);
	for (const path of paths) {
		await page.goto(path);
		const description =
			(await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
		expect(description.length, path).toBeGreaterThan(50);
		expect(description.length, path).toBeLessThanOrEqual(160);
		expect((await page.title()).length, path).toBeLessThanOrEqual(80);
	}
});

test('a guide for parents: the plan, the song with its questions, the sources; linked from the song', async ({
	page
}) => {
	await page.goto('/piosenka/gdy-sie-zgubie');
	await page.getByRole('link', { name: /PORADNIK DLA RODZICÓW/ }).click();
	await expect(page).toHaveURL(/\/poradnik\/co-zrobic-gdy-dziecko-zgubi-sie-w-sklepie$/);
	await expect(page).toHaveTitle('Co zrobić, gdy dziecko zgubi się w sklepie?');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Co zrobić, gdy dziecko zgubi się w sklepie?'
	);
	await expect(page.getByRole('heading', { name: 'Plan dla dziecka: pięć kroków' })).toBeVisible();
	await expect(page.getByText('Stój jak drzewo.')).toBeVisible();
	await expect(page.getByText(/116 000, Telefon w Sprawie Zaginionego Dziecka/)).toBeVisible();
	await expect(page.getByRole('button', { name: 'Włącz: Gdy się zgubię' })).toBeVisible();
	await expect(page.getByText('Kogo w sklepie możesz poprosić o pomoc?')).toBeVisible();
	const sources = page.getByRole('region', { name: 'Źródła' }).getByRole('link');
	await expect(sources).toHaveCount(4);
	const article = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((all) =>
			all.map((s) => JSON.parse(s.textContent ?? '')).find((b) => b['@type'] === 'Article')
		);
	expect(article).toMatchObject({
		headline: 'Co zrobić, gdy dziecko zgubi się w sklepie?',
		datePublished: '2026-10-24',
		inLanguage: 'pl'
	});
	// The list of guides, from the footer
	await page.getByRole('contentinfo').getByRole('link', { name: 'Poradniki' }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Poradniki dla rodziców');
	await expect(
		page.getByRole('link', { name: /Co zrobić, gdy dziecko zgubi się w sklepie/ })
	).toBeVisible();
	// And from the page for parents, beside its song
	await page.goto('/dla-rodzicow');
	await expect(
		page.getByRole('link', { name: 'Poradnik: Co zrobić, gdy dziecko zgubi się w sklepie?' })
	).toBeVisible();
});

test('the guides beside their songs: secrets, purchases in games', async ({ page }) => {
	for (const [song, guide] of [
		[
			'/piosenka/niespodzianka-tak-sekret-nie',
			'Dobry i zły sekret – jak rozmawiać o tym z dzieckiem?'
		],
		['/piosenka/zlote-monetki', 'Jak zablokować zakupy w grach na telefonie dziecka?']
	]) {
		await page.goto(song);
		await page.getByRole('link', { name: new RegExp(guide.replace(/[?]/g, '\\?')) }).click();
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(guide);
		await expect(
			page.getByRole('region', { name: 'Źródła' }).getByRole('link').first()
		).toBeVisible();
	}
	await expect(
		page.getByText('Ustawienia → Czas przed ekranem → Aplikacje i witryny.')
	).toBeVisible();
	await page.goto('/poradnik');
	await expect(page.locator('a.guide')).toHaveCount(5);
});

test('for kindergartens: a lesson plan for every song, its colouring page to print', async ({
	page
}) => {
	await page.goto('/');
	await page.getByRole('contentinfo').getByRole('link', { name: 'Dla przedszkoli' }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Zajęcia o bezpieczeństwie z Pikselkiem'
	);
	// In the order of the home page, the newest first, with the topics of the songs
	await expect(page.locator('.lessons > li')).toHaveCount(5);
	await expect(page.locator('.lessons h2')).toHaveText([
		'Jeden, jeden, dwa',
		'Niespodzianka tak, sekret nie',
		'Złote monetki',
		'Gdy się zgubię',
		'Klik z głową'
	]);
	await expect(page.locator('.lessons > li').first()).toContainText('Numer 112');
	await expect(page.getByText('Bezpłatnie')).toBeVisible();
	// The days with their exact dates, not "w lutym" (the dates themselves: tests/unit/lessons.test.ts)
	// (after the last date in lib/days.ts: where to look it up)
	await expect(
		page.getByText(/(, \d{1,2} lutego \d{4}|saferinternet\.pl\)) – Dzień Bezpiecznego Internetu/)
	).toBeVisible();
	await expect(
		page
			.locator('.lessons')
			.getByText(/^Dzień Bezpiecznego Internetu – ([a-zśęą]+, \d{1,2} lutego \d{4}|w lutym.*)$/)
	).toBeVisible();
	await page.getByRole('link', { name: /^Scenariusz\s*: Jeden, jeden, dwa\b/ }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Jeden, jeden, dwa: numer alarmowy 112'
	);
	await expect(
		page.getByText(/Europejski Dzień Numeru Alarmowego 112 – [a-zśęą]+, 11 lutego \d{4}/)
	).toBeVisible();
	await expect(page.locator('.step')).toHaveCount(6);
	await page.getByRole('link', { name: 'Kolorowanka do druku' }).click();
	await expect(page).toHaveURL(/\/kolorowanka\/jeden-jeden-dwa$/);
	await expect(page.getByRole('img', { name: /Pikselek do pokolorowania/ })).toBeVisible();
	await expect(page.getByText('Dzwonię pod 112. Mówię, co się stało i gdzie')).toBeVisible();
	// On paper: only the sheet
	await page.emulateMedia({ media: 'print' });
	await expect(page.getByRole('button', { name: /Drukuj/ })).toBeHidden();
	await expect(page.getByRole('img', { name: /Pikselek do pokolorowania/ })).toBeVisible();
	// From a song's page too
	await page.emulateMedia({ media: 'screen' });
	await page.goto('/piosenka/gdy-sie-zgubie');
	await expect(page.getByRole('link', { name: 'scenariusz zajęć' })).toHaveAttribute(
		'href',
		/dla-przedszkoli\/gdy-sie-zgubie$/
	);
	// The song about 112 too, and its guide (they were tied to the short before the song came out)
	await page.goto('/piosenka/jeden-jeden-dwa');
	await expect(page.getByRole('link', { name: 'scenariusz zajęć' })).toHaveAttribute(
		'href',
		/dla-przedszkoli\/jeden-jeden-dwa$/
	);
	await expect(
		page.getByRole('link', { name: /Jak nauczyć dziecko dzwonić pod numer 112/ })
	).toBeVisible();
});

test('an unknown guide is a 404', async ({ page }) => {
	const res = await page.goto('/poradnik/nie-ma-takiego');
	expect(res?.status()).toBe(404);
});

test('the menu: four places, the one of the page marked, also under it', async ({ page }) => {
	await page.goto('/poradnik/jak-nauczyc-dziecko-dzwonic-pod-112');
	const nav = await menu(page);
	await expect(nav.getByRole('link')).toHaveText([
		'Piosenki',
		'Dla rodziców',
		'Dla przedszkoli',
		'Poradniki'
	]);
	await expect(nav.getByRole('link', { name: 'Poradniki' })).toHaveAttribute(
		'aria-current',
		'true'
	);
	await nav.getByRole('link', { name: 'Dla przedszkoli' }).click();
	await expect(page).toHaveURL(/\/dla-przedszkoli$/);
	await expect((await menu(page)).getByRole('link', { name: 'Dla przedszkoli' })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await page.goto('/piosenka/gdy-sie-zgubie');
	await expect((await menu(page)).getByRole('link', { name: 'Piosenki' })).toHaveAttribute(
		'aria-current',
		'true'
	);
	await expect(page.getByRole('banner').getByRole('link', { name: /YouTube/ })).toHaveAttribute(
		'href',
		/sub_confirmation=1$/
	);
});

test('the header stays one row, without sideways scrolling', async ({ page }) => {
	for (const path of ['/', '/dla-rodzicow', '/dla-przedszkoli', '/poradnik']) {
		await page.goto(path);
		expect((await page.getByRole('banner').boundingBox())?.height).toBeLessThan(90);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
});

test('on a phone the menu opens with its button and closes with Esc or a page', async ({
	page,
	isMobile
}) => {
	test.skip(!isMobile, 'a computer shows the menu at once');
	await page.goto('/');
	const toggle = page.getByRole('button', { name: 'Menu' });
	const nav = page.getByRole('navigation', { name: 'Menu' });
	await expect(nav).toBeHidden();
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	await expect(nav).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(nav).toBeHidden();
	await expect(toggle).toBeFocused();
	await toggle.click();
	await nav.getByRole('link', { name: 'Poradniki' }).click();
	await expect(page).toHaveURL(/\/poradnik$/);
	await expect(nav).toBeHidden();
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('the footer: © doner.cloud, no e-mail', async ({ page }) => {
	await page.goto('/');
	const footer = page.getByRole('contentinfo');
	await expect(footer.getByRole('link', { name: /^doner\.cloud/ })).toHaveAttribute(
		'href',
		'https://doner.cloud/'
	);
	await expect(footer).toContainText(`© ${new Date().getFullYear()} doner.cloud`);
	await expect(footer.getByRole('link', { name: 'Kontakt' })).toHaveCount(0);
	for (const name of ['Tryb dla dziecka', 'Dla rodziców', 'Dla przedszkoli', 'Poradniki'])
		await expect(footer.getByRole('link', { name })).toBeVisible();
});

test('the privacy page names who is responsible', async ({ page }) => {
	await page.goto('/prywatnosc');
	await expect(page.getByText('Administratorem danych jest Adam Tomaś')).toBeVisible();
});

test('lessons for a day say it to search engines, with the date', async ({ page }) => {
	await page.goto('/dla-przedszkoli/klik-z-glowa');
	await expect(page).toHaveTitle(/^Dzień Bezpiecznego Internetu w przedszkolu – scenariusz zajęć/);
	await expect(page.locator('meta[name="description"]')).toHaveAttribute(
		'content',
		/^Scenariusz zajęć na Dzień Bezpiecznego Internetu \((\d{1,2} lutego \d{4}|luty)\)/
	);
	await page.goto('/dla-przedszkoli/jeden-jeden-dwa');
	await expect(page).toHaveTitle(/^Dzień 112 w przedszkolu/);
	await expect(page.locator('meta[name="description"]')).toHaveAttribute(
		'content',
		/Dzień 112 \(11 lutego \d{4}\)/
	);
	await page.goto('/dla-przedszkoli/gdy-sie-zgubie');
	await expect(page).toHaveTitle(/^Scenariusz zajęć: Gdy się zgubię/);
});
