import { Fragment, ReactNode } from "react"
import { replaceAllSubstrings } from "util/stringReplacer"

export const MarkdownTextParser = ({
	str,
	className,
}: {
	str: string
	className?: string
}) => {
	const boldIndexPairs: number[][] = []

	// This will get the start & end indexes of all instances
	// of strings between "**" (including the "**")
	Array.from(str.matchAll(/\*{2}/g)).forEach(({ index }, i) => {
		typeof index === "number" &&
			(i % 2 === 0
				? boldIndexPairs.push([index])
				: boldIndexPairs[boldIndexPairs.length - 1].push(index + 1))
	})
	const allBoldIndexes = boldIndexPairs.flat()
	const formattedStrings: ReactNode[] = []

	const boldStringFormatter = (start: number, end: number) => (
		<strong className={className}>
			{replaceAllSubstrings(str.substring(start, end), "**")}
		</strong>
	)

	if (allBoldIndexes.length > 0) {
		let lastBoldAdded = 0

		for (let i = 0; i < str.length; i) {
			if (allBoldIndexes.includes(i)) {
				const nextIndex = boldIndexPairs[lastBoldAdded][1] + 1
				formattedStrings.push(boldStringFormatter(i, nextIndex))
				i = nextIndex
				lastBoldAdded++
			} else {
				const nextIndex = !!boldIndexPairs[lastBoldAdded]
					? boldIndexPairs[lastBoldAdded][0]
					: str.length
				formattedStrings.push(
					<span>{str.substring(i, nextIndex)}</span>,
				)
				i = nextIndex
			}
		}
	} else formattedStrings.push(str)

	return (
		<>
			{formattedStrings.map((subStr, index) => (
				<Fragment key={index}>{subStr}</Fragment>
			))}
		</>
	)
}
