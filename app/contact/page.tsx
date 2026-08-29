import type { Metadata } from "next"
import { getSite } from "@/lib/content"

export const metadata: Metadata = {
	title: "Contact",
}

// No form and no server action here by design (R30): the fastest way to
// reach out is still just email, carried over in tone from the old Contact.
export default function ContactPage() {
	const site = getSite()

	return (
		<div className="mx-auto max-w-measure px-gutter py-section">
			<h1 className="font-medium text-display tracking-[-0.025em]">
				Reach out
			</h1>
			<p className="mt-4 text-fg-2 text-h2">
				The fastest way to get to me is through{" "}
				<a
					href={`mailto:${site.email}`}
					className="text-accent underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:underline"
				>
					email
				</a>
				.
			</p>
			<p className="mt-8 font-mono text-fg-2 text-meta uppercase">Elsewhere</p>
			<ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small">
				{site.socials.map((social) => (
					<li key={social.url}>
						<a
							href={social.url}
							target="_blank"
							rel="noreferrer noopener"
							className="text-accent underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:underline"
						>
							{social.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}
