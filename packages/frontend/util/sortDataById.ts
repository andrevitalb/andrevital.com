export const sortDataByMainId = (data?: any[]) =>
	!!data
		? [...data].sort(
				({ id: firstId }, { id: secondId }) => firstId - secondId,
		  )
		: []
