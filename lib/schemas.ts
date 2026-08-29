import { z } from "zod"

export const statusSchema = z.enum(["draft", "published"])

export const baseContentSchema = z.object({
	title: z.string(),
	slug: z.string(),
	summary: z.string(),
	date: z.coerce.date(),
	status: statusSchema,
	tags: z.array(z.string()).default([]),
})

export const workLinkSchema = z.object({
	label: z.string(),
	url: z.url(),
})

export const workPermissionSchema = z.object({
	clientName: z.boolean().default(false),
	screenshots: z.boolean().default(false),
})

export const workSchema = baseContentSchema.extend({
	kind: z.enum(["client", "personal", "tool"]),
	role: z.string(),
	team: z.string().optional(),
	period: z.string(),
	links: z.array(workLinkSchema).default([]),
	hero: z.string(),
	permission: workPermissionSchema.default({
		clientName: false,
		screenshots: false,
	}),
})

export const craftDemoSchema = z.union([
	z.object({ kind: z.literal("component"), id: z.string() }),
	z.object({ kind: z.literal("video"), src: z.string() }),
])

export const craftSchema = baseContentSchema.extend({
	demo: craftDemoSchema.optional(),
})

export const postSchema = baseContentSchema

export const siteSchema = z.object({
	name: z.string(),
	positioning: z.string(),
	aboutStatement: z.string(),
	email: z.email(),
	bio: z.array(z.string()),
	socials: z.array(
		z.object({
			label: z.string(),
			url: z.url(),
		}),
	),
})

export type Status = z.infer<typeof statusSchema>
export type Work = z.infer<typeof workSchema>
export type Craft = z.infer<typeof craftSchema>
export type Post = z.infer<typeof postSchema>
export type Site = z.infer<typeof siteSchema>
