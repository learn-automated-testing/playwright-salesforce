// @ts-check
import { devices } from 'playwright';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default {
  timeout: 300000, // Set global timeout for all tests
  expect: {
    timeout: 10 * 1000,
  },

  testDir: './tests', // Specify the test directory
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail if test.only is left in the code on CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests on CI
  workers: process.env.CI ? 1 : undefined, // Limit workers on CI to avoid overloading
  reporter: 'html', // Use HTML reporter

  // Shared settings for all projects
  use: {
    video: 'on', // Record video for all tests
    trace: 'on-first-retry', // Collect trace for first retry only
    baseURL: process.env.BASE_URL || 'https://www.salesforce.com', // Use environment variable for base URL
    headless: process.env.HEADLESS !== 'false', // Use headless mode unless specified otherwise
    screenshot: 'only-on-failure', // Capture screenshots only on test failure
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
  },

  // Define projects for major browsers
  projects: [
    {
      name: 'default',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Example of running a local dev server before tests
  // Uncomment and configure as needed
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
};
