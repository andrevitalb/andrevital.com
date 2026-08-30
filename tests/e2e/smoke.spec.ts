import { readFileSync } from "node:fs"
import path from "node:path"
import { parse as parseYaml } from "yaml"
import { expect, test } from "./fixtures"

function experienceCount(): number {
	const raw = readFileSync(
		path.join(import.meta.dirname, "..", "..", "content", "cv.yaml"),
		"utf8",
	)
	return (parseYaml(raw) as { experience: unknown[] }).experience.length
}

test("home responds and shows the site name", async ({ page }) => {
	const response = await page.goto("/")

	expect(response?.status()).toBe(200)
	await expect(page.getByRole("heading", { name: "André Vital" })).toBeVisible()
})

test("an unknown route 404s with the real, styled page", async ({ page }) => {
	// U8 flagged Craft on in this build, so there is no hidden section left here
	// to compare against. That comparison lives in tests/e2e/hidden.spec.ts,
	// which runs against a build with every section off and checks the two
	// responses byte for byte rather than by heading.
	const unknown = await page.goto("/this-route-does-not-exist")

	expect(unknown?.status()).toBe(404)
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Whoops,")
})

test("theme toggle persists across reload", async ({ page }) => {
	await page.goto("/")
	const toggle = page.getByRole("button", { name: /switch to/i })
	await expect(toggle).toBeVisible()

	const initialLabel = await toggle.getAttribute("aria-label")
	await toggle.click()

	await expect(
		page.getByRole("button", { name: /switch to/i }),
	).not.toHaveAttribute("aria-label", initialLabel ?? "")
	const toggledLabel = await page
		.getByRole("button", { name: /switch to/i })
		.getAttribute("aria-label")

	await page.reload()
	await expect(
		page.getByRole("button", { name: /switch to/i }),
	).toHaveAttribute("aria-label", toggledLabel ?? "")
})

test.describe("with a light system preference", () => {
	test.use({ colorScheme: "light" })

	test("the first load is light", async ({ page }) => {
		await page.goto("/")

		const scheme = await page.evaluate(
			() => getComputedStyle(document.documentElement).colorScheme,
		)
		expect(scheme).toContain("light")
	})
})

test("the logo mark's rendered color flips with the theme", async ({
	page,
}) => {
	await page.goto("/")

	const readLogoColor = () =>
		page.evaluate(() => {
			const letter = document.querySelector(
				'#site-logo [data-logo-part="letter-a"]',
			)
			return letter ? getComputedStyle(letter).fill : null
		})

	const initialColor = await readLogoColor()
	expect(initialColor).not.toBeNull()

	await page.getByRole("button", { name: /switch to/i }).click()
	const toggledColor = await readLogoColor()

	expect(toggledColor).not.toBe(initialColor)
})

for (const viewport of [
	{ width: 320, height: 700 },
	{ width: 390, height: 844 },
	{ width: 1440, height: 900 },
]) {
	test(`no horizontal scroll at ${viewport.width}px on home, about and contact`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport)

		await page.goto("/")
		const homeOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(homeOverflow).toBe(false)

		await page.goto("/contact")
		const contactOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(contactOverflow).toBe(false)

		// R24: About is the densest page on the site, with an 11rem date column
		// beside prose, so it is the one most likely to push the viewport wide.
		await page.goto("/about")
		const aboutOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(aboutOverflow).toBe(false)

		await page.goto("/work")
		const workOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(workOverflow).toBe(false)

		// The piece page is the only one with a fixed-padding frame around a
		// square demo and a control row that wraps, so 320px is where it shows.
		for (const route of ["/craft", "/craft/logo-draw"]) {
			await page.goto(route)
			const craftOverflow = await page.evaluate(
				() =>
					document.documentElement.scrollWidth >
					document.documentElement.clientWidth,
			)
			expect(craftOverflow, route).toBe(false)
		}
	})
}

test("work is served with Work visible, and its draft entry is not", async ({
	page,
}) => {
	await page.goto("/")
	// Nav is built from the flag, so a visible section has to appear in it.
	await expect(page.locator('nav a[href="/work"]')).toHaveCount(1)

	const list = await page.goto("/work")
	expect(list?.status()).toBe(200)
	await expect(
		page.getByRole("heading", { level: 1, name: "Work" }),
	).toBeVisible()

	// AE4, R26. content/work/example-client.mdx is the only entry there is and it
	// is a draft, so a production build has to leave it out of the list and build
	// no route for it. That empty state is what /work legitimately looks like
	// until the content sprint fills it, and it is checked rather than assumed:
	// a draft that leaked would show up here first.
	await expect(page.getByText("Nothing published yet.")).toBeVisible()

	const draft = await page.goto("/work/example-client")
	expect(draft?.status()).toBe(404)
})

test("about renders the CV timeline and links the generated PDF", async ({
	page,
}) => {
	const response = await page.goto("/about")
	expect(response?.status()).toBe(200)

	await expect(
		page.getByRole("heading", { name: "Where I have worked" }),
	).toBeVisible()
	await expect(
		page.getByRole("heading", { level: 3, name: /Metalab/ }),
	).toBeVisible()

	// Every entry in content/cv.yaml reaches the page: a loader that silently
	// dropped one would still pass a "the timeline renders" assertion. Counted
	// from the YAML rather than hardcoded, so adding a job is a content edit
	// and not an e2e failure.
	await expect(page.locator("main h3")).toHaveCount(experienceCount())

	await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute(
		"href",
		"/cv.pdf",
	)
})

test("the generated CV PDF is served, including from its legacy URLs", async ({
	page,
}) => {
	const direct = await page.request.get("/cv.pdf")
	expect(direct.status()).toBe(200)
	expect(direct.headers()["content-type"]).toContain("pdf")

	// R22: the old site linked a capitalised filename, and the case mismatch
	// between the link and the tracked file is what 404'd it on Vercel. Fetched
	// rather than navigated to: Chromium downloads a PDF instead of loading it,
	// which fails page.goto outright.
	for (const legacy of ["/docs/en/cv.pdf", "/docs/en/CV.pdf"]) {
		const hop = await page.request.get(legacy, { maxRedirects: 0 })
		expect(hop.status()).toBe(308)
		expect(hop.headers().location).toBe("/cv.pdf")

		const followed = await page.request.get(legacy)
		expect(followed.status()).toBe(200)
		expect(followed.headers()["content-type"]).toContain("pdf")
	}
})

test("the legacy blog URLs redirect to Writing", async ({ page }) => {
	// R39. Permanent redirects, so 308 rather than 307.
	for (const [legacy, destination] of [
		["/blog", "/writing"],
		[
			"/blog/setting-up-a-multi-package-project",
			"/writing/setting-up-a-multi-package-project",
		],
	]) {
		const hop = await page.request.get(legacy, { maxRedirects: 0 })
		expect(hop.status()).toBe(308)
		expect(hop.headers().location).toBe(destination)
	}

	const followed = await page.goto("/blog/setting-up-a-multi-package-project")
	expect(followed?.status()).toBe(200)
	expect(new URL(page.url()).pathname).toBe(
		"/writing/setting-up-a-multi-package-project",
	)
})

test("the kind filter's CSS rule hides the rows it should", async ({
	page,
}) => {
	// The filter is a hydrated nav plus a rule in app/globals.css, and the rule is
	// the half no unit test can reach: jsdom applies no stylesheet. There is no
	// published Work entry to filter yet (the only entry is the draft template),
	// so the rows are injected into the real container, with the same shape
	// WorkList and WorkFilter render, and checked against the real stylesheet in
	// a real browser. WorkList.test.tsx and WorkFilter.test.tsx pin that shape.
	await page.goto("/work")

	const displays = await page.evaluate(() => {
		const container = document.querySelector(".work-filter")
		if (!container) return null

		container.insertAdjacentHTML(
			"afterbegin",
			'<nav aria-label="Filter by kind" data-active-kind="tool"></nav>',
		)
		container.insertAdjacentHTML(
			"beforeend",
			'<ul><li data-kind="client" id="probe-client"></li><li data-kind="tool" id="probe-tool"></li></ul>',
		)

		const read = (id: string) => {
			const node = document.getElementById(id)
			return node ? getComputedStyle(node).display : null
		}
		const before = { client: read("probe-client"), tool: read("probe-tool") }

		document
			.querySelector(".work-filter > nav")
			?.removeAttribute("data-active-kind")
		const after = { client: read("probe-client"), tool: read("probe-tool") }

		return { before, after }
	})

	expect(displays, "no .work-filter container on the page").not.toBeNull()
	expect(displays?.before.tool).not.toBe("none")
	expect(displays?.before.client).toBe("none")
	// No active kind is what an unknown ?tag= leaves behind: everything shows.
	expect(displays?.after.client).not.toBe("none")
	expect(displays?.after.tool).not.toBe("none")
})

test("the legacy develop URLs point at Work while it is visible", async ({
	page,
}) => {
	// Temporary while the flag decides the destination, so 307 rather than 308:
	// a permanent redirect would be cached by the browser and outlive the flip.
	const hop = await page.request.get("/develop/roomfit", { maxRedirects: 0 })
	expect(hop.status()).toBe(307)
	expect(hop.headers().location).toBe("/work")
})

test("craft is served with Craft visible and lists the logo piece", async ({
	page,
}) => {
	await page.goto("/")
	// Nav is built from the flag, so a visible section has to appear in it.
	await expect(page.locator('nav a[href="/craft"]')).toHaveCount(1)

	const list = await page.goto("/craft")
	expect(list?.status()).toBe(200)
	await expect(
		page.getByRole("heading", { level: 1, name: "Craft" }),
	).toBeVisible()

	await page.getByRole("link", { name: "Drawing the logo" }).click()
	await expect(
		page.getByRole("heading", { level: 1, name: "Drawing the logo" }),
	).toBeVisible()
})

test("the logo piece's demo mounts, replays and takes a speed", async ({
	page,
}) => {
	await page.goto("/craft/logo-draw")

	// The nav renders the same mark, so the demo is located inside the article.
	const demo = page.getByRole("article").locator("svg")
	await expect(demo).toHaveCount(1)
	await expect(demo.locator("[data-logo-part]").first()).toBeAttached()

	// First interaction, so the click is retried: the controls are server-rendered
	// and a click that lands before hydration is simply lost.
	const half = page.getByRole("button", { name: "0.5×" })
	await expect(async () => {
		await half.click()
		await expect(half).toHaveAttribute("aria-pressed", "true")
	}).toPass()
	await expect(
		page.getByRole("button", { name: "1×", exact: true }),
	).toHaveAttribute("aria-pressed", "false")

	// Replay is a remount -- that is how motion runs a finished sequence again --
	// so the old SVG leaving the document is the assertion that it happened.
	const before = await demo.elementHandle()
	await page.getByRole("button", { name: "Replay" }).click()
	await expect
		.poll(() => before?.evaluate((node) => node.isConnected))
		.toBe(false)
	await expect(page.getByRole("article").locator("svg")).toHaveCount(1)
})

test.describe("with reduced motion", () => {
	test.use({ contextOptions: { reducedMotion: "reduce" } })

	test("the logo piece shows the finished mark and draws only on request", async ({
		page,
	}) => {
		await page.goto("/craft/logo-draw")

		// R9. Same tell as the intro's reduced-motion case: the drawing mark carries
		// a dash pattern and the plain one never does. The demo replaces the static
		// mark once it hydrates, so this polls rather than reading once.
		const dashArray = () =>
			page.evaluate(() => {
				const part = document.querySelector("article [data-logo-part]")
				return part ? getComputedStyle(part).strokeDasharray : null
			})

		// The server already renders the static mark, so asserting the dash pattern
		// straight away would pass before any of the demo's own code has run. The
		// speed button is the hydration signal: its aria-pressed only flips once
		// the client owns the controls, and pressing it is not a request to draw.
		const half = page.getByRole("button", { name: "0.5×" })
		await expect(async () => {
			await half.click()
			await expect(half).toHaveAttribute("aria-pressed", "true")
		}).toPass()
		await expect.poll(dashArray).toBe("none")

		// Pressing Replay is a request for motion, so it draws.
		await expect(async () => {
			await page.getByRole("button", { name: "Replay" }).click()
			await expect.poll(dashArray).not.toBe("none")
		}).toPass()
	})
})

test("writing lists the migrated post with its date and tags", async ({
	page,
}) => {
	const response = await page.goto("/writing")
	expect(response?.status()).toBe(200)

	const link = page.getByRole("link", {
		name: /Setting up a multi-package project/,
	})
	await expect(link).toBeVisible()
	await expect(link).toHaveAttribute(
		"href",
		"/writing/setting-up-a-multi-package-project",
	)
	await expect(page.getByText("10 Apr 2023")).toBeVisible()
	await expect(page.getByText("project-setup")).toBeVisible()
})

test("the post renders highlighted, line-numbered code", async ({ page }) => {
	await page.goto("/writing/setting-up-a-multi-package-project")

	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Setting up a multi-package project",
		}),
	).toBeVisible()

	// Parity with the old Prism renderer: real highlighting, not a plain <pre>.
	// Deliberately a labelled block. The first block on this page is a folder
	// tree with no language, which rehype-pretty-code lexes as plaintext, and
	// plaintext tokens correctly inherit the prose colour instead of taking one
	// from the theme.
	const highlighted = page.locator('pre[data-language="json"]').first()
	await expect(highlighted).toBeVisible()

	const token = highlighted.locator("[data-line] span").first()
	const tokenColor = await token.evaluate(
		(node) => getComputedStyle(node).color,
	)
	const proseColor = await page
		.locator(".prose p")
		.first()
		.evaluate((node) => getComputedStyle(node).color)
	expect(tokenColor).not.toBe(proseColor)

	// Line numbers. They are a CSS counter, and no browser resolves counter()
	// in getComputedStyle, so what is checkable is that the rule still lands on
	// the element: `none` here is what a changed rehype-pretty-code line wrapper
	// would produce, and is the regression worth catching. Read off the first
	// block on the page, the unlabelled one: numbering has to reach plaintext
	// too, which is what `defaultLang` in Mdx.tsx buys.
	const firstBlock = page.locator("pre[data-language]").first()
	const lineNumbering = await firstBlock
		.locator("[data-line]")
		.first()
		.evaluate((node) => {
			const before = getComputedStyle(node, "::before")
			return { content: before.content, increment: before.counterIncrement }
		})
	expect(lineNumbering.content).toContain("counter(line)")
	expect(lineNumbering.increment).toContain("line")

	const numberedLines = await firstBlock.locator("[data-line]").count()
	expect(numberedLines).toBeGreaterThan(0)
})

test("the post's code theme follows the theme toggle", async ({ page }) => {
	await page.goto("/writing/setting-up-a-multi-package-project")

	const token = page
		.locator('pre[data-language="json"] [data-line] span')
		.first()
	const readColor = () => token.evaluate((node) => getComputedStyle(node).color)

	const initialColor = await readColor()
	await page.getByRole("button", { name: /switch to/i }).click()

	// Polled, not read once: the class swap goes through a next-themes state
	// update, so a bare read straight after the click can land before the paint.
	await expect.poll(readColor).not.toBe(initialColor)
})

test("the RSS feed is served and carries the published post", async ({
	page,
}) => {
	const response = await page.request.get("/feed.xml")

	expect(response.status()).toBe(200)
	expect(response.headers()["content-type"]).toContain("application/rss+xml")

	const xml = await response.text()
	expect(xml).toContain(
		"<link>https://andrevital.com/writing/setting-up-a-multi-package-project</link>",
	)

	// Autodiscovery: a reader that lands on the site finds the feed without it
	// being linked in the body.
	await page.goto("/writing")
	await expect(
		page.locator('link[rel="alternate"][type="application/rss+xml"]'),
	).toHaveAttribute("href", "/feed.xml")
})

for (const viewport of [
	{ width: 320, height: 700 },
	{ width: 1440, height: 900 },
]) {
	test(`no horizontal scroll at ${viewport.width}px on writing and the post`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport)

		// The post is the widest content on the site: every code block is a long
		// unwrapped line, so this is what an unscoped `overflow-x` would break.
		for (const route of [
			"/writing",
			"/writing/setting-up-a-multi-package-project",
		]) {
			await page.goto(route)
			const overflows = await page.evaluate(
				() =>
					document.documentElement.scrollWidth >
					document.documentElement.clientWidth,
			)
			expect(overflows, route).toBe(false)
		}
	})
}
