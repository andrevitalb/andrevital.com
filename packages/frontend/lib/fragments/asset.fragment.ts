import { gql } from "@apollo/client"
import { Media, mediaFields } from "./media.fragment"

export interface Asset {
	assetId: number
	assetSlug: string
	artist?: string
	media: Media
}

export const assetFields = gql`
	fragment AssetFields on Asset {
		assetId
		assetSlug
		artist
		media {
			data {
				attributes {
					...MediaFields
				}
			}
		}
	}
	${mediaFields}
`
