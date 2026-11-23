import { defineConfig } from '@playwright/test';
import process from 'node:process';

export default defineConfig({
  testDir: './tests/pages',
  outputDir: '/tmp/brixum-pages-test-results',
  timeout: 60000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PAGES_URL || 'http://127.0.0.1:4173/brixum/',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PAGES_URL
    ? undefined
    : {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort --base /brixum/',
        url: 'http://127.0.0.1:4173/brixum/',
        reuseExistingServer: false,
      },
});
