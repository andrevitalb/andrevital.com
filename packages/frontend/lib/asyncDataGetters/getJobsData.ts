import { getJobsQuery, Job } from "lib/hooks/useJobs"
import { sortDataByMainId } from "util/sortDataById"
import { asyncApolloClient } from "./asyncApolloClient"

export const getJobsData = async () => {
	const { data } = await asyncApolloClient.query({
		query: getJobsQuery,
	})

	return sortDataByMainId(
		data?.jobs?.data?.flatMap(
			({ id, attributes }: { id: number; attributes: Job }) => ({
				...attributes,
				id,
				descriptionBullets: sortDataByMainId(
					attributes.descriptionBullets,
				),
			}),
		),
	) as Job[]
}
