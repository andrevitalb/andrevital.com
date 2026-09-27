// Shared by DemoFrame and each demo: the frame owns the stage and the label, the
// demo owns its controls, and both land in the one row under the stage.
export const STAGE =
	"flex aspect-video items-center justify-center overflow-hidden bg-bg-2 min-[640px]:aspect-[21/9]"

export const CONTROL_ROW =
	"mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 font-mono text-meta uppercase tracking-widest"

export const CONTROL =
	"uppercase text-fg-2 underline decoration-1 decoration-transparent underline-offset-4 transition-colors duration-(--duration-fast) hover:text-fg aria-pressed:text-fg aria-pressed:decoration-accent"
