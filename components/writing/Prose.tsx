import { Mdx } from "@/components/mdx/Mdx"

// Typography for compiled MDX. The rules are in app/globals.css under `.prose`:
// MDX compiles to plain HTML, so there is no element here to hang a className on.
export function Prose({ source }: { source: string }) {
	return (
		<div className="prose max-w-measure">
			<Mdx source={source} />
		</div>
	)
}
