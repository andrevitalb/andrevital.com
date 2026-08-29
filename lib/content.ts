import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { parse as parseYaml } from "yaml"
import {
	type Craft,
	craftSchema,
	type Post,
	postSchema,
	type Site,
	siteSchema,
	type Work,
	workSchema,
} from "./schemas"

export type Collection = "work" | "craft" | "writing"

type ContentEntry<T> = T & { content: string }

const schemas = {
	work: workSchema,
	craft: craftSchema,
	writing: postSchema,
} as const

type GetAllOptions = {
	includeDrafts?: boolean
	root?: string
}

function contentRoot(root?: string) {
	return root ?? path.join(process.cwd(), "content")
}

function readMdxFileNames(dir: string): string[] {
	if (!existsSync(dir)) return []
	return readdirSync(dir).filter((fileName) => fileName.endsWith(".mdx"))
}

function formatIssues(issues: { path: PropertyKey[]; message: string }[]) {
	return issues
		.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
		.join("; ")
}

export function getAll(
	collection: "work",
	options?: GetAllOptions,
): ContentEntry<Work>[]
export function getAll(
	collection: "craft",
	options?: GetAllOptions,
): ContentEntry<Craft>[]
export function getAll(
	collection: "writing",
	options?: GetAllOptions,
): ContentEntry<Post>[]
export function getAll(
	collection: Collection,
	{
		includeDrafts = process.env.NODE_ENV !== "production",
		root,
	}: GetAllOptions = {},
): ContentEntry<Work | Craft | Post>[] {
	const dir = path.join(contentRoot(root), collection)
	const schema = schemas[collection]

	const entries = readMdxFileNames(dir).map((fileName) => {
		const filePath = path.join(dir, fileName)
		const raw = readFileSync(filePath, "utf8")
		const { data, content } = matter(raw)
		const result = schema.safeParse(data)
		if (!result.success) {
			throw new Error(
				`Invalid front matter in ${filePath}: ${formatIssues(result.error.issues)}`,
			)
		}
		return { ...result.data, content }
	})

	const filtered = includeDrafts
		? entries
		: entries.filter((entry) => entry.status !== "draft")

	return filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function getSite(root?: string): Site {
	const filePath = path.join(contentRoot(root), "site.yaml")
	const raw = readFileSync(filePath, "utf8")
	const data = parseYaml(raw)
	const result = siteSchema.safeParse(data)
	if (!result.success) {
		throw new Error(
			`Invalid site data in ${filePath}: ${formatIssues(result.error.issues)}`,
		)
	}
	return result.data
}
