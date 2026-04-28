import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Change this to match your folder structure
  testDir: './src/tests/e2e', 
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});