import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	use: {
		baseURL: "http://localhost:4317",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "pnpm build && pnpm exec next start -p 4317",
		url: "http://localhost:4317",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
})
