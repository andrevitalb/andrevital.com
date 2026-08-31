import { expect, test } from "./fixtures"

// Buttons default to cursor: default in every browser. Nothing on this site set
// a pointer, so every control read as inert to the hand even where it worked.
test("an interactive control carries a pointer cursor", async ({ page }) => {
	await page.goto("/")

	const toggle = page.getByRole("button", { name: /theme/i })
	await expect(toggle).toHaveCSS("cursor", "pointer")
})
