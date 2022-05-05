import { gql, useQuery } from "@apollo/client"
import { projectFields } from "lib/fragments/project.fragment"
import { sortDataByMainId } from "util/sortDataById"
import {
	Project,
	projectAttributesMapper,
	ProjectEntityType,
} from "./useProject"

const getPortfolioQuery = gql`
	query GetPortfolio($categoryName: String) {
		projects(filters: { category: { eq: $categoryName } }) {
			data {
				id
				attributes {
					...ProjectFields
				}
			}
		}
	}
	${projectFields}
` as import("./__generated__/get-portfolio").GetPortfolioDocument

export function usePortfolio(categoryName?: string) {
	const { data: getPortfolio } = useQuery(getPortfolioQuery, {
		variables: { categoryName },
	})
	const results: Project[] = getPortfolio?.projects?.data?.flatMap(
		(project: ProjectEntityType) => projectAttributesMapper(project),
	)

	return sortDataByMainId(results) as Project[]
}
