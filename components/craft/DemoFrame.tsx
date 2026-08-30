import { DEMO_IDS, DEMOS } from "@/components/craft/demos"
import type { Craft } from "@/lib/schemas"

type Demo = NonNullable<Craft["demo"]>

// R16: a piece is carried by a live demo or a short looping video. This is the
// frame both sit in; the controls belong to the demo, since only the demo knows
// what there is to replay or to slow down.
//
// A server component on purpose. The registry's next/dynamic entries are already
// their own chunks, and keeping the frame on the server means a piece page still
// prerenders its demo's first frame into the HTML instead of shipping a hole.
export function DemoFrame({ demo, title }: { demo: Demo; title: string }) {
	return (
		<div className="rounded-md border border-line bg-bg-2 p-8">
			{demo.kind === "video" ? (
				// controls, even though it autoplays and loops on its own: WCAG 2.2.2
				// wants a way to stop anything that moves for more than five seconds,
				// and the native control set is that way. No captions: a silent UI
				// capture has nothing to caption, and the piece's prose describes it.
				<video
					src={demo.src}
					autoPlay
					loop
					muted
					playsInline
					controls
					aria-label={title}
					className="mx-auto w-full max-w-measure rounded-sm"
				/>
			) : (
				<Component id={demo.id} />
			)}
		</div>
	)
}

function Component({ id }: { id: string }) {
	const Demo = DEMOS[id]
	// Thrown while prerendering, so an id that names no demo fails the build
	// rather than rendering an empty frame in production.
	if (!Demo) {
		throw new Error(
			`Unknown craft demo "${id}". Known demos: ${DEMO_IDS.join(", ")}.`,
		)
	}

	return <Demo />
}
