export const fetchProjectGalleryItemSubindex = (imageUrl: string): string =>
	imageUrl.split("-").slice(-1)[0]
