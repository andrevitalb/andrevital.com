import { defineConfig, devices } from "@playwright/test"

const VISIBLE_PORT = 4317
const HIDDEN_PORT = 4319

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	use: {
		baseURL: `http://localhost:${VISIBLE_PORT}`,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			testIgnore: /hidden\.spec\.ts/,
			use: { ...devices["Desktop Chrome"] },
		},
		// The intro leans on inert, sessionStorage and SVG stroke animation, which
		// is where WebKit is most likely to differ. Only that spec runs twice.
		{
			name: "webkit",
			testMatch: /intro\.spec\.ts/,
			use: { ...devices["Desktop Safari"] },
		},
		// Runs against the second build below, the one with every section flagged
		// off. That is the shape Work and Craft actually ship in, and it is where
		// three separate leaks hid until U6, so it gets its own build rather than
		// being inferred from unit tests.
		{
			name: "hidden-sections",
			testMatch: /hidden\.spec\.ts/,
			use: {
				...devices["Desktop Chrome"],
				baseURL: `http://localhost:${HIDDEN_PORT}`,
			},
		},
	],
	webServer: [
		{
			command: `pnpm build && pnpm exec next start -p ${VISIBLE_PORT}`,
			url: `http://localhost:${VISIBLE_PORT}`,
			// Every section on, so each one is exercised rather than assumed. The
			// 404-parity case moved to the hidden-sections project below, which is
			// the build where nothing is visible; .env.development is not read by
			// `next build`, so this is the only place that says so.
			env: { NEXT_PUBLIC_SECTIONS: "work,craft,writing" },
			reuseExistingServer: !process.env.CI,
			timeout: 120_000,
		},
		{
			command: `pnpm build && pnpm exec next start -p ${HIDDEN_PORT}`,
			url: `http://localhost:${HIDDEN_PORT}`,
			// Its own distDir, or the two builds overwrite each other.
			env: { NEXT_PUBLIC_SECTIONS: "", NEXT_DIST_DIR: ".next-hidden" },
			reuseExistingServer: !process.env.CI,
			timeout: 120_000,
		},
	],
})
