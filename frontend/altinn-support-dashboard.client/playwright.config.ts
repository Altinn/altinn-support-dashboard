import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL = isCI ? "http://localhost:5173" : "https://localhost:5173";

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['html'], ['json']] : 'html',
  use: {
    baseURL: baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx vite --host',
    url: baseURL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCI,
    ...(isCI && { env: { NODE_ENV: 'test' } }),
  },
});
