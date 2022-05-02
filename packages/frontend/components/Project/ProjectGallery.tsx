import { Masonry } from "components/common/layout/Masonry"
import { GalleryItem } from "contexts/ProjectsContext"
import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgVideo from "lightgallery/plugins/video"
import LightGallery from "lightgallery/react"
import { ReactNode, useEffect, useState } from "react"
import { formatTwoDigitNumber } from "util/formatNumberStrings"
import { fetchProjectGalleryItemSubindex } from "util/projectGallerySubindexFetcher"
import { ProjectGalleryItem } from "./ProjectGalleryItem"

const ProjectGallery = ({ galleryItems }: { galleryItems: ReactNode[] }) => {
	return (
		<LightGallery
			speed={350}
			plugins={[lgThumbnail, lgVideo]}
			download={false}
			elementClassNames="customLightGallery"
			selector=".project__gallery__item"
		>
			<Masonry
				items={galleryItems}
				itemSelector=".project__gallery__item"
			/>
		</LightGallery>
	)
}

export const ProjectGalleryWrapper = ({
	name,
	category,
	galleryUrls,
}: {
	name: string
	category: string
	galleryUrls: GalleryItem[]
}) => {
	const [galleryItems, setGalleryItems] = useState<ReactNode[] | null>()

	useEffect(() => {
		setGalleryItems(
			galleryUrls.map(({ id, assetUrl, thumbnailUrl, artist, size }) => {
				const label = `${artist ?? name} #${formatTwoDigitNumber(
					fetchProjectGalleryItemSubindex(assetUrl),
				)}`

				return (
					<ProjectGalleryItem
						key={id}
						category={category}
						projectName={name}
						label={label}
						size={size ?? ""}
						assetCaption={`<h4>${label}</h4>`}
						assetUrl={assetUrl}
						thumbnailUrl={thumbnailUrl ?? assetUrl}
					/>
				)
			}),
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [galleryUrls])

	return (
		<>{!!galleryItems && <ProjectGallery galleryItems={galleryItems} />}</>
	)
}
