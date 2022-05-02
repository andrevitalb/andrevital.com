import { replaceAllSubstrings } from "util/stringReplacer"

export const MarkdownTextParser = ({
	str,
	className,
}: {
	str: string
	className?: string
}) => {
	if (str.indexOf("**") !== -1)
		return (
			<strong className={className}>
				{replaceAllSubstrings(str, "**")}
			</strong>
		)
	return <span>{str}</span>
}
