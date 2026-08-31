import type { Metadata } from "next"
import { TextLink } from "@/components/ui/Link"
import { getSite } from "@/lib/content"
import { pageMetadata } from "@/lib/site"

const site = getSite()

export const metadata: Metadata = pageMetadata("/contact", {
	siteName: site.name,
	title: "Contact",
	description: `Reach ${site.name} by email or on social.`,
})

// No form and no server action here by design (R30): the fastest way to
// reach out is still just email, carried over in tone from the old Contact.
export default function ContactPage() {
	const site = getSite()

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="max-w-measure">
				<h1 className="font-medium text-display tracking-[-0.025em]">
					Reach out
				</h1>
				<p className="mt-4 text-fg-2 text-h2">
					The fastest way to get to me is through{" "}
					<TextLink href={`mailto:${site.email}`} variant="primary">
						email
					</TextLink>
					.
				</p>
				<p className="mt-8 font-mono text-fg-2 text-meta uppercase">
					Elsewhere
				</p>
				<ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small">
					{site.socials.map((social) => (
						<li key={social.url}>
							<TextLink href={social.url} variant="quiet" external>
								{social.label}
							</TextLink>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
