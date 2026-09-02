// The directory grid: a mono metadata column beside a wide content column,
// collapsing to one column under 760px. docs/design.md "Layout" records why the
// breakpoint is one number: it drifted to two once, which put About in one
// column while the Writing index was still in two.
//
// The columns only. Gap and alignment stay at each call site, because they
// already differ correctly: About's bands use gap-y-4, the CV rows
// items-baseline gap-y-2, the Writing rows items-baseline gap-y-3. Folding
// those in here would force one rhythm on three different kinds of row.
export const DIRECTORY_GRID = "min-[760px]:grid-cols-[11rem_minmax(0,1fr)]"
