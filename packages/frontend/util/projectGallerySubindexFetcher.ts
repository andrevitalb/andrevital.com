export const fetchProjectGalleryItemSubindex = (imageUrl: string) => {
	const dashFragments = imageUrl.split("-")
	return dashFragments[dashFragments.length - 1].split(".")[0]
}
