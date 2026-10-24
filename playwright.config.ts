import { defineConfig, devices } from '@playwright/test';

// The app as built for production, before launch (no INDEXING), with the channel from tests/fixtures (no YouTube
// API key needed); YouTube's player is replaced in the browser (tests/e2e/youtube.ts)
const APP_PORT = 4173;
const headless = (userAgent: string) => `${userAgent} Headless`;

export default defineConfig({
	testDir: 'tests/e2e',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://127.0.0.1:${APP_PORT}`,
		trace: 'retain-on-failure'
	},
	// Browsers of the tests say they are headless, so the statistics do not count them (lib/server/stats.ts)
	projects: [
		{
			name: 'desktop',
			use: {
				...devices['Desktop Chrome'],
				userAgent: headless(devices['Desktop Chrome'].userAgent)
			}
		},
		// A phone 360 px wide: the menu scrolls sideways on its own, the page never does
		{
			name: 'phone',
			use: {
				...devices['Galaxy S9+'],
				userAgent: headless(devices['Galaxy S9+'].userAgent),
				viewport: { width: 360, height: 740 }
			}
		}
	],
	webServer: {
		command: 'npm run build && node build',
		url: `http://127.0.0.1:${APP_PORT}/health`,
		timeout: 180_000,
		env: {
			PORT: String(APP_PORT),
			ORIGIN: `http://127.0.0.1:${APP_PORT}`,
			HOST: '127.0.0.1',
			DATA_DIR: '.data/e2e',
			CHANNEL_FIXTURE: 'tests/fixtures/channel.json',
			STATS_FLUSH_MS: '200'
		},
		reuseExistingServer: !process.env.CI
	}
});
