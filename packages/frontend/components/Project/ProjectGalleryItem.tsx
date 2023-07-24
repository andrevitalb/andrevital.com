export interface ProjectGalleryItemProps {
	category: string
	projectName: string
	label: string
	size: string
	assetCaption: string
	assetUrl: string
	thumbnailUrl: string
}

export const ProjectGalleryItem = ({
	category,
	projectName,
	label,
	size,
	assetCaption,
	assetUrl,
	thumbnailUrl,
}: ProjectGalleryItemProps) => {
	return (
		<a
			data-lg-size={size}
			data-src={assetUrl}
			data-sub-html={assetCaption}
			tw="block w-full"
			className="project__gallery__item"
		>
			<div tw="overflow-hidden cursor-pointer object-cover">
				<img
					src={thumbnailUrl}
					alt={category === "photo" ? `${label} | ${projectName}` : label}
					tw="block transition-all duration-[400ms] hover:scale-[1.20]"
				/>
			</div>
		</a>
	)
}
