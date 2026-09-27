"use client"

import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { type ReactNode, useState } from "react"
import { IconButton } from "@/components/ui/IconButton"

/**
 * Plays a specimen again.
 *
 * The site's motion is CSS: scroll timelines, transitions and keyframes keyed on
 * data attributes, with no JavaScript driving any of it. So the only honest way
 * to replay one is to make it mount again, which is what bumping the key does.
 * A CSS animation restarts when its element is new; nothing here touches the
 * animation itself, and that is deliberate, because a specimen that ran on its
 * own timing engine would stop being evidence of what the site does.
 *
 * The whole design page's client bundle. Everything else on it is server-rendered.
 */
export function Replay({
	label,
	children,
}: {
	/** Names what replays, so the control has an accessible name per specimen. */
	label: string
	children: ReactNode
}) {
	const [take, setTake] = useState(0)

	return (
		<div className="grid gap-4">
			<div key={take}>{children}</div>

			<IconButton
				label={`Replay ${label}`}
				onClick={() => setTake((previous) => previous + 1)}
				className="justify-self-start"
			>
				<ArrowClockwiseIcon size={18} />
			</IconButton>
		</div>
	)
}
