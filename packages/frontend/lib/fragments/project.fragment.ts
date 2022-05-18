import { gql } from "@apollo/client"
import { assetFields } from "./asset.fragment"
import { mediaFields } from "./media.fragment"
import { tagFields } from "./tag.fragment"

export const projectFields = gql`
	fragment ProjectFields on Project {
		projectId
		name
		description
		category
		tags {
			data {
				id
				attributes {
					...TagFields
				}
			}
		}
		externalUrl
		galleryAssets {
			data {
				attributes {
					...AssetFields
				}
			}
		}
		accentColor
		thumbnail {
			data {
				attributes {
					...MediaFields
				}
			}
		}
		logo {
			data {
				attributes {
					...MediaFields
				}
			}
		}
	}
	${tagFields}
	${assetFields}
	${mediaFields}
`
