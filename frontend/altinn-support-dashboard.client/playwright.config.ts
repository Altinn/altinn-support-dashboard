import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL = isCI ? "http://localhost:5173" : "https://localhost:5173";

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: 'html',
  use: {
    baseURL: baseURL,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx vite --host',
    url: baseURL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCI,
    ...(isCI && { 
      env: { 
        NODE_ENV: 'test' ,
        ASPNETCORE_URLS: 'http://localhost:5237',
      } 
    }),
  },
});
