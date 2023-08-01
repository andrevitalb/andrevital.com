import camelCase from "lodash/camelCase"

const isServerSide = typeof window === "undefined"

const envBase = {
	NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
} as const
type EnvBase = typeof envBase

/**
 * Environment variable values are given in an object whose property names are
 * converted from environment variable names by removing any `NEXT_PUBLIC_`
 * prefix, and converting to camel case.
 */
export type Env = {
	[K in keyof EnvBase as CamelCase<NoPublicPrefix<K>>]: NonNullable<EnvBase[K]>
}

export default parse(envBase)

function parse(e: EnvBase): Env {
	const result: Record<string, string> = {}
	const errors: string[] = []
	for (const [key, value] of Object.entries(e)) {
		const isDefined = Boolean(value)
		const isPublic = key.startsWith("NEXT_PUBLIC_")

		// If there is no value for a variable we want to return an error. But
		// when running in the browser we should not expect server-side variables
		// to be defined. (Only variables prefixed with NEXT_PUBLIC_ are sent to
		// the browser.) So skip error reporting if a server-side variable is
		// missing in the browser.
		if (isDefined || (!isServerSide && !isPublic)) {
			result[convertVariableName(key as keyof EnvBase)] = value as string
		} else {
			errors.push(`- ${key}`)
		}
	}
	if (!!errors.length) {
		throw new Error(
			new Date().toISOString() +
				" These environment variable(s) are required, but are not set:\n" +
				errors.join("\n"),
		)
	}
	return result as Env
}

/**
 * Type-level conversion from snake_case or SCREAMING_SNAKE_CASE to camelCase
 */
type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
	? `${Lowercase<Head>}${Capitalize<CamelCase<Tail>>}`
	: Lowercase<S>

/**
 * Type-level conversion to remove `NEXT_PUBLIC_` prefix from a string literal
 * type
 */
type NoPublicPrefix<S extends string> = S extends `NEXT_PUBLIC_${infer Tail}`
	? Tail
	: S

function convertVariableName(key: keyof EnvBase): keyof Env {
	return camelCase(key.replace("NEXT_PUBLIC_", "")) as keyof Env
}
