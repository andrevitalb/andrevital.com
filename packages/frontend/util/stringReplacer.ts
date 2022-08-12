export const replaceAllSubstrings = (
	initialString: string,
	search: string,
	replaceWith = "",
) => initialString.split(search).join(replaceWith)
