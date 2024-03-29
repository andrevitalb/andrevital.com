export const sortDataByMainId = (data?: any[], desc: boolean = true) => {
	const sortFunc = desc
		? ({ id: firstId }: any, { id: secondId }: any) => firstId - secondId
		: ({ id: firstId }: any, { id: secondId }: any) => secondId - firstId
	return !!data ? [...data].sort(sortFunc) : []
}
