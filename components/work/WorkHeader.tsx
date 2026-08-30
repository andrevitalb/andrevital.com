import Image from "next/image"
import type { Work } from "@/lib/schemas"

/**
 * R14. An entry names its client only where `permission.clientName` records
 * written permission; otherwise the title and summary carry it by domain and
 * the facts below stand on their own. That is the half of R14 code can hold.
 * `permission.screenshots` is a recorded fact, not a switch: nothing here can
 * tell a real client screen from an abstract one, so which file `hero` points
 * at stays the author's call under the rule content/work/example-client.mdx
 * spells out.
 */
export function WorkHeader({ entry }: { entry: Work }) {
	const facts = [
		{ label: "Role", value: entry.role },
		{ label: "Period", value: entry.period },
		...(entry.team ? [{ label: "Team", value: entry.team }] : []),
		...(entry.permission.clientName && entry.client
			? [{ label: "Client", value: entry.client }]
			: []),
	]

	return (
		<header>
			<div className="max-w-measure">
				<h1 className="font-medium text-display leading-[1.1] tracking-[-0.025em]">
					{entry.title}
				</h1>
				<p className="mt-4 text-fg-2 text-h2">{entry.summary}</p>
				{entry.tags.length > 0 && (
					<p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-fg-2 text-meta uppercase">
						{entry.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))}
					</p>
				)}
			</div>

			<dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-meta min-[640px]:grid-cols-4">
				{facts.map((fact) => (
					<div key={fact.label}>
						<dt className="text-fg-2 uppercase">{fact.label}</dt>
						<dd className="mt-0.5 text-fg">{fact.value}</dd>
					</div>
				))}
			</dl>

			{entry.links.length > 0 && (
				<p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
					{entry.links.map((link) => (
						<a
							key={link.url}
							href={link.url}
							target="_blank"
							rel="noreferrer noopener"
							className="font-mono text-meta uppercase underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
						>
							{link.label}
						</a>
					))}
				</p>
			)}

			<div className="mt-10 overflow-hidden rounded-md border border-line bg-bg-2">
				<Image
					src={entry.hero}
					alt=""
					width={1200}
					height={630}
					sizes="(min-width: 62rem) 62rem, 100vw"
					priority
					className="aspect-[16/9] w-full object-cover"
				/>
			</div>
		</header>
	)
}
