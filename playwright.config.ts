import { defineConfig, devices } from '@playwright/test';

/**
 * Ported from the Selenium framework's config.properties + BaseTest:
 *   base.url                   -> use.baseURL
 *   browser=chrome             -> projects: chromium
 *   headless=false             -> HEADLESS=false for a headed run (default is headless)
 *   explicit.wait.seconds=20   -> expect.timeout
 *   page.load.timeout.seconds=60 -> use.navigationTimeout
 *   ChromeOptions --window-size=1920,1080 -> use.viewport
 *   Allure screenshot / page-source on failure -> use.screenshot + use.trace
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  expect: {
    // explicit.wait.seconds=20
    timeout: 20_000,
  },

  use: {
    // config.properties has base.url=https://login.salesforce.com/?locale=in
    // The query string stays with the navigation call in the spec.
    baseURL: 'https://login.salesforce.com',
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1920, height: 1080 },
    // page.load.timeout.seconds=60
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // The Selenium BaseTest also supported firefox and edge.
    // Enable these after running: npx playwright install firefox webkit
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],
});
