import { gql, useQuery } from "@apollo/client"

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

const getJobsQuery = gql`
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
`

export function useJobs() {
	const { data: getJobs } = useQuery(getJobsQuery)
	const results: Job[] = getJobs?.jobs?.data?.flatMap(
		({ id, attributes }: { id: number; attributes: Job }) => ({
			...attributes,
			descriptionBullets: [...attributes.descriptionBullets].sort(
				({ id: firstId }, { id: secondId }) => firstId - secondId,
			),
			id,
		}),
	)

	return results?.sort(
		({ id: firstId }, { id: secondId }) => firstId - secondId,
	)
}
