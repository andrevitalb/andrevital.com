export const replaceAllSubstrings = (
	initialString: string,
	search: string,
	replaceWith: string = "",
) => initialString.split(search).join(replaceWith)
