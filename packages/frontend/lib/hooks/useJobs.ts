import { gql, useQuery } from "@apollo/client"
import { sortDataByMainId } from "util/sortDataById"

export interface JobDate {
	month: string
	year: string
}

export interface Job {
	id: number
	jobId: string
	companyName: string
	companyPageUrl: string
	position: string
	location: string
	startDate: JobDate
	endDate: JobDate
	descriptionBullets: Array<{ id: number; bullet: string }>
}

export const getJobsQuery = gql`
	query GetJobs {
		jobs {
			data {
				id
				attributes {
					jobId
					companyName
					companyPageUrl
					position
					location
					startDate {
						month
						year
					}
					endDate {
						month
						year
					}
					descriptionBullets {
						id
						bullet
					}
				}
			}
		}
	}
` as import("./__generated__/get-jobs").GetJobsDocument

export function useJobs() {
	const { data: getJobs } = useQuery(getJobsQuery)
	return sortDataByMainId(
		getJobs?.jobs?.data?.flatMap(
			({ id, attributes }: { id: number; attributes: Job }) => ({
				...attributes,
				descriptionBullets: sortDataByMainId(
					attributes.descriptionBullets,
				),
				id,
			}),
		),
	) as Job[]
}
