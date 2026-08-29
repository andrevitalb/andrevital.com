import { expect, test } from "@playwright/test"

test("home responds and shows the site name", async ({ page }) => {
	const response = await page.goto("/")

	expect(response?.status()).toBe(200)
	await expect(page.getByRole("heading", { name: "André Vital" })).toBeVisible()
})
