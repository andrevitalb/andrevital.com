"use client"

import { useSearchParams } from "next/navigation"
import { type MouseEvent, useRef, useState } from "react"
import { flushSync } from "react-dom"
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
/**
 * The nav mounts only after hydration, so the page has to hold its place from
 * the first paint or the list drops by its height when it arrives. Measured at
 * 0.04 CLS before the fallback below reserved the same box.
 */
// Shared with the Suspense fallback so the nav holds its box before it hydrates
// (0.04 CLS otherwise). self-start is what lets sticky work in a grid cell.
export const FILTER_NAV_BOX =
	"flex gap-4 pb-10 pl-6 min-[760px]:sticky min-[760px]:top-12 min-[760px]:flex-col min-[760px]:self-start min-[760px]:pb-0 min-[760px]:pl-0"

export function WorkFilter({ kinds }: { kinds: Work["kind"][] }) {
	// A click sets `tag` itself so the change can land inside a view transition;
	// any other navigation (back, forward, the nav's own Work link) still arrives
	// through the URL and is adopted here.
	const urlTag = useSearchParams().get("tag")
	const [tag, setTag] = useState(urlTag)
	const [seenUrlTag, setSeenUrlTag] = useState(urlTag)
	if (urlTag !== seenUrlTag) {
		setSeenUrlTag(urlTag)
		setTag(urlTag)
	}
	const transition = useRef<ViewTransition>(null)
	const active = kinds.find((kind) => kind === tag)

	// Next keeps useSearchParams in step with pushState, and a plain left click is
	// all this takes over: a modified click still opens its tab.
	const filter = (
		event: MouseEvent<HTMLAnchorElement>,
		next: string | null,
	) => {
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return
		}
		event.preventDefault()
		const href = event.currentTarget.href
		// Next answers pushState by updating useSearchParams, which re-renders this
		// with the new tag, so it has to run after the old snapshot is taken.
		const update = () => {
			flushSync(() => setTag(next))
			window.history.pushState(null, "", href)
		}

		if (
			!document.startViewTransition ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			update()
			return
		}

		// data-filtering scopes the transition to the rows (see app/globals.css).
		const root = document.documentElement
		root.dataset.filtering = ""
		const current = document.startViewTransition(update)
		transition.current = current
		current.finished.finally(() => {
			if (transition.current === current) delete root.dataset.filtering
		})
	}

	return (
		<nav
			aria-label="Filter by kind"
			data-active-kind={active}
			className={FILTER_NAV_BOX}
		>
			{[undefined, ...kinds].map((kind) => (
				<a
					key={kind ?? "all"}
					href={kind ? `/work?tag=${kind}` : "/work"}
					onClick={(event) => filter(event, kind ?? null)}
					aria-current={active === kind ? "true" : undefined}
					className={`block font-mono text-meta uppercase underline decoration-1 underline-offset-4 transition-colors duration-(--duration-fast) hover:decoration-accent ${
						active === kind
							? "text-fg decoration-accent"
							: "text-fg-2 decoration-line"
					}`}
				>
					{kind ? KIND_LABEL[kind] : "All"}
				</a>
			))}
		</nav>
	)
}
