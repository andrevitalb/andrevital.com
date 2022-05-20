import { Masonry } from "components/common/layout/Masonry"
import { Asset } from "lib/fragments/asset.fragment"
import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgVideo from "lightgallery/plugins/video"
import LightGallery from "lightgallery/react"
import { ReactNode, useEffect, useState } from "react"
import { formatTwoDigitNumber } from "util/formatNumberStrings"
import {
	getBiggestFormatImage,
	getSmallestFormatImage,
} from "util/getSelectFormatImage"
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
			<Masonry itemSelector=".project__gallery__item">
				<>{galleryItems}</>
			</Masonry>
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
	galleryUrls: Asset[]
}) => {
	const [galleryItems, setGalleryItems] = useState<ReactNode[] | null>()

	useEffect(() => {
		setGalleryItems(
			galleryUrls.map(({ assetId, assetSlug, media, artist }) => {
				const label = `${artist ?? name} #${formatTwoDigitNumber(
					fetchProjectGalleryItemSubindex(assetSlug),
				)}`

				const mainImage = getBiggestFormatImage(media.formats)

				return (
					<ProjectGalleryItem
						key={assetId}
						category={category}
						projectName={name}
						label={label}
						size={`${mainImage.size}`}
						assetCaption={`<h4>${label}</h4>`}
						assetUrl={mainImage.url}
						thumbnailUrl={getSmallestFormatImage(media.formats).url}
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
