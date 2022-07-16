import imagesLoaded from "imagesloaded"
import { ReactNode, useEffect, useRef } from "react"
import tw from "twin.macro"

interface MasonryProps {
	gap?: string
	className?: string
	children: ReactNode
	itemSelector: string
}

/**
 * Masonry provides a wrapper component that displays items resembling
 * the original [masonry library](https://masonry.desandro.com/) manner.
 *
 * @param gap The separation between items in px
 * @param className Additional classes that will be added to the wrapper
 * @param itemSelector The selector that is used to refer to all items (usually a class)
 */
export const Masonry = ({
	gap = "16px",
	className,
	children,
	itemSelector,
}: MasonryProps) => {
	const grid = useRef<HTMLDivElement | null>(null)

	const resizeGridItem = (item: HTMLElement) => {
		const gridAutoRows = grid.current?.style.gridAutoRows
		const rowHeight = parseInt(!!gridAutoRows ? gridAutoRows : "1px")
		const rowSpan = Math.ceil(
			((item.querySelector("div")?.offsetHeight ?? 50) + parseInt(gap)) /
				(rowHeight + parseInt(gap)),
		)
		item.style.gridRowEnd = `span ${rowSpan - 1}`
	}

	const resizeAllGridItems = () => {
		if (!!grid.current) {
			const itemRefs = [
				...grid.current.querySelectorAll(itemSelector),
			] as HTMLElement[]
			itemRefs.forEach((item) => resizeGridItem(item))
		}
	}

	const resizeInstance = (instance: any) => {
		resizeGridItem(instance.elements[0])
	}

	const attachOnLoadResizer = () => {
		if (!!grid.current) {
			const itemRefs = [
				...grid.current.querySelectorAll(itemSelector),
			] as HTMLElement[]
			itemRefs.forEach((item) => imagesLoaded(item, resizeInstance))
		}
	}

	useEffect(() => {
		resizeAllGridItems()
		attachOnLoadResizer()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<MasonryWrapper className={className} ref={grid}>
			{children}
		</MasonryWrapper>
	)
}

const MasonryWrapper = tw.div`
	grid gap-4 auto-rows-[1px]
	grid-cols-1
	md:grid-template-columns[repeat(auto-fill, minmax(calc((100% - 3rem) / 2), 1fr))]
	lg:grid-template-columns[repeat(auto-fill, minmax(calc((100% - 3rem) / 4), 1fr))]
`
