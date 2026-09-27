import Image from "next/image"
import { RailFacts } from "@/components/layout/EntryLayout"
import { TextLink } from "@/components/ui/Link"
import type { Work } from "@/lib/schemas"

/**
 * R14. An entry names its client only where `permission.clientName` records
 * written permission; otherwise the title and summary carry it by domain and
 * the facts beside them stand on their own. That is the half of R14 code can
 * hold. `permission.screenshots` is a recorded fact, not a switch: nothing here
 * can tell a real client screen from an abstract one, so which file `hero`
 * points at stays the author's call under the rule content/work/example-client.mdx
 * spells out.
 *
 * The facts are a column of labels rather than a stripe of equal columns, which
 * is what lets an entry with no team and no client still look finished: a rail
 * is as long as it is, a stripe shows its missing cells.
 */
export function WorkFacts({ entry }: { entry: Work }) {
	const facts = [
		{ label: "Role", value: entry.role },
		{ label: "Period", value: entry.period },
		...(entry.team ? [{ label: "Team", value: entry.team }] : []),
		...(entry.permission.clientName && entry.client
			? [{ label: "Client", value: entry.client }]
			: []),
	]

	return (
		<>
			<RailFacts facts={facts} />

			{entry.tags.length > 0 && (
				<p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-fg-2 text-meta uppercase min-[760px]:flex-col">
					{entry.tags.map((tag) => (
						<span key={tag}>{tag}</span>
					))}
				</p>
			)}

			{entry.links.length > 0 && (
				<p className="flex flex-wrap gap-x-6 gap-y-2 min-[760px]:flex-col">
					{entry.links.map((link) => (
						<TextLink
							key={link.url}
							href={link.url}
							external
							className="w-fit font-mono text-meta uppercase"
						>
							{link.label}
						</TextLink>
					))}
				</p>
			)}
		</>
	)
}

// The page's LCP element, so priority stays.
export function WorkHero({ entry }: { entry: Work }) {
	return (
		<Image
			src={entry.hero}
			alt=""
			width={1200}
			height={630}
			sizes="(min-width: 760px) 43rem, 100vw"
			priority
			className="aspect-video w-full object-cover"
		/>
	)
}
