"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { Work } from "@/lib/schemas"
import { KIND_LABEL } from "@/lib/work"

/**
 * The nav only, and the only thing on /work that reads the URL. Reading a search
 * param opts everything up to the nearest Suspense boundary out of the static
 * HTML, so the list stays outside this component and outside that boundary: it
 * is server-rendered markup that ships in the page, and what hides the rows that
 * do not match is the `data-active-kind` rule in app/globals.css, keyed off the
 * attribute below. Nothing about an entry crosses the client boundary.
 *
 * Without JavaScript there is no nav and the full list stands, which is the
 * degradation KTD9 promises. An unknown ?tag= is not a kind, so it leaves
 * `data-active-kind` unset and shows everything rather than nothing.
 */
export function WorkFilter({ kinds }: { kinds: Work["kind"][] }) {
	const tag = useSearchParams().get("tag")
	const active = kinds.find((kind) => kind === tag)

	return (
		<nav
			aria-label="Filter by kind"
			data-active-kind={active}
			className="mb-10 flex gap-4"
		>
			{[undefined, ...kinds].map((kind) => (
				<Link
					key={kind ?? "all"}
					href={kind ? `/work?tag=${kind}` : "/work"}
					aria-current={active === kind ? "true" : undefined}
					className={`font-mono text-meta uppercase underline decoration-1 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent ${
						active === kind
							? "text-fg decoration-accent"
							: "text-fg-2 decoration-line"
					}`}
				>
					{kind ? KIND_LABEL[kind] : "All"}
				</Link>
			))}
		</nav>
	)
}
