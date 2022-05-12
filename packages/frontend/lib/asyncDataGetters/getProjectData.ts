import { getProjectQuery, projectAttributesMapper } from "lib/hooks/useProject"
import { asyncApolloClient } from "./asyncApolloClient"

export const getProjectData = async (projectId: string) => {
	const { data } = await asyncApolloClient.query({
		query: getProjectQuery,
		variables: { projectId },
	})

	return projectAttributesMapper(data.projects.data[0])
}
