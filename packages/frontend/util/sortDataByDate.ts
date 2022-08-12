interface ItemWithPostDate {
	postDate: string
}

export const sortDataByDate = (data?: any[], newerFirst = true) => {
	const sortFunction = (a: ItemWithPostDate, b: ItemWithPostDate) =>
		newerFirst
			? +new Date(b.postDate) - +new Date(a.postDate)
			: +new Date(a.postDate) - +new Date(b.postDate)

	return !!data ? [...data].sort(sortFunction) : []
}
