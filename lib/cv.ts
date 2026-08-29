import { readFileSync } from "node:fs"
import path from "node:path"
import { parse as parseYaml } from "yaml"
import { z } from "zod"

const monthYearSchema = z.object({
	month: z.int().min(1).max(12),
	year: z.int().min(1900).max(2100),
})

const linkSchema = z.object({ label: z.string(), url: z.url() })

const experienceSchema = z
	.object({
		company: z.string(),
		url: z.url().optional(),
		position: z.string(),
		location: z.string(),
		start: monthYearSchema,
		end: monthYearSchema.optional(),
		present: z.boolean().default(false),
		bullets: z.array(z.string()).min(1),
	})
	// An entry with neither `end` nor `present` has no readable period at all,
	// and one with both is ambiguous about which wins. Both are authoring
	// mistakes rather than states to render, so they fail validation here.
	.refine((entry) => entry.present !== (entry.end !== undefined), {
		// Named by company, not by array index: the index alone sends whoever
		// broke it counting entries in the YAML to find the one at fault.
		error: (issue) =>
			`"${(issue.input as { company?: string }).company ?? "entry"}" needs either an \`end\` date or \`present: true\`, not both and not neither`,
	})

export const cvSchema = z.object({
	profile: z.object({
		name: z.string(),
		headline: z.string(),
		location: z.string(),
		email: z.email(),
		links: z.array(linkSchema),
	}),
	summary: z.string(),
	experience: z.array(experienceSchema).min(1),
	education: z.array(
		z.object({
			degree: z.string(),
			institution: z.string(),
			// For the About fact column, where the full institution name eats
			// four lines of a 14rem column. The CV outputs always spell it out.
			abbreviation: z.string().optional(),
			graduated: monthYearSchema,
		}),
	),
	languages: z.array(z.object({ name: z.string(), level: z.string() })),
	skills: z.array(z.object({ label: z.string(), items: z.string() })),
	references: z.string(),
})

export type MonthYear = z.infer<typeof monthYearSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Cv = z.infer<typeof cvSchema>

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const

export function formatMonthYear(
	{ month, year }: MonthYear,
	style: "long" | "short" = "long",
): string {
	const name = MONTHS[month - 1]
	return `${style === "short" ? name.slice(0, 3) : name} ${year}`
}

/**
 * "October 2024 - Present" for the CV outputs, "Oct 2024 to now" for the page.
 * The short form drops the repeated year on a range that opens and closes in
 * the same one ("Jan to Jul 2023"), which is what the approved comp shows.
 */
export function formatPeriod(
	entry: Experience,
	style: "long" | "short" = "long",
): string {
	const separator = style === "short" ? "to" : "-"
	const end = entry.end
		? formatMonthYear(entry.end, style)
		: style === "short"
			? "now"
			: "Present"

	const sameYear =
		entry.end !== undefined && entry.end.year === entry.start.year
	const start =
		style === "short" && sameYear
			? MONTHS[entry.start.month - 1].slice(0, 3)
			: formatMonthYear(entry.start, style)

	return `${start} ${separator} ${end}`
}

export type EmphasisSpan = { text: string; bold: boolean }

/**
 * Splits `**bold**` runs out of a bullet. Bullets are hand-written CV prose,
 * not markdown documents, so this covers the one marker they use rather than
 * pulling in a parser: anything else passes through as literal text.
 */
export function parseEmphasis(text: string): EmphasisSpan[] {
	const spans: EmphasisSpan[] = []

	for (const part of text.split(/(\*\*[^*]+\*\*)/g)) {
		if (part === "") continue
		const bold = part.startsWith("**") && part.endsWith("**")
		spans.push({ text: bold ? part.slice(2, -2) : part, bold })
	}

	return spans
}

export function getCv(root?: string): Cv {
	const filePath = path.join(
		root ?? path.join(process.cwd(), "content"),
		"cv.yaml",
	)
	const result = cvSchema.safeParse(parseYaml(readFileSync(filePath, "utf8")))

	if (!result.success) {
		throw new Error(
			`Invalid CV data in ${filePath}: ${result.error.issues
				.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
				.join("; ")}`,
		)
	}

	return result.data
}

function displayUrl(url: string): string {
	return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

/**
 * Renders the CV as the markdown career-ops reads (R23). The shape is the
 * consumer's contract, not a style choice: headings per company, bold
 * position, a plain date line, bullets carried through untouched with their
 * `**` markers intact. Documented in docs/cv-format.md.
 */
export function toMarkdown(cv: Cv): string {
	const { profile } = cv
	const lines: string[] = [
		"<!-- Generated from content/cv.yaml by scripts/build-cv.tsx. Do not edit by hand. -->",
		"",
		`# CV -- ${profile.name}`,
		"",
		`**Location:** ${profile.location}`,
		`**Email:** ${profile.email}`,
		...profile.links.map(
			(link) => `**${link.label}:** ${displayUrl(link.url)}`,
		),
		"",
		"## Professional Summary",
		"",
		cv.summary,
		"",
		"## Experience",
		"",
		"<!-- Bullets below are verbatim from content/cv.yaml, the single source for the CV. **bold** marks included. Tailoring may reorder them, never reword them. -->",
	]

	for (const entry of cv.experience) {
		lines.push(
			"",
			`### ${entry.company} -- ${entry.location}`,
			"",
			`**${entry.position}**`,
			formatPeriod(entry),
			"",
			...entry.bullets.map((bullet) => `- ${bullet}`),
		)
	}

	lines.push("", "## Education", "")
	for (const entry of cv.education) {
		lines.push(
			`**${entry.degree}** -- ${entry.institution}`,
			`Graduated ${formatMonthYear(entry.graduated)}`,
		)
	}

	lines.push(
		"",
		"## Languages",
		"",
		...cv.languages.map((language) => `- ${language.name}: ${language.level}`),
		"",
		"## References",
		"",
		cv.references,
		"",
		"## Skills",
		"",
		...cv.skills.map((skill) => `- **${skill.label}:** ${skill.items}`),
		"",
	)

	return lines.join("\n")
}
