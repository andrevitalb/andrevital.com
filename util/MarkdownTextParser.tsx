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

const replaceAllSubstrings = (
	initialString: string,
	search: string,
	replaceWith: string = "",
) => initialString.split(search).join(replaceWith)
