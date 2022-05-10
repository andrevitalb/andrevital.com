import { JobDate } from "lib/hooks/useJobs"

export const jobDatesFormatter = (startDate: JobDate, endDate?: JobDate) => `
    ${startDate.month}${
	startDate.year !== endDate?.year ? ` ${startDate.year} ` : " "
}- ${!!endDate?.month ? endDate?.month : "Present"}${
	!!endDate?.year ? ` ${endDate?.year}` : ""
}
`
