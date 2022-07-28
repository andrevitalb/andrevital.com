import { gql } from "@apollo/client"
import { mediaFields } from "./media.fragment"
import { tagFields } from "./tag.fragment"

export const articleFields = gql`
	fragment ArticleFields on Article {
		slug
		title
		content
		tags {
			data {
				id
				attributes {
					...TagFields
				}
			}
		}
		thumbnail {
			data {
				attributes {
					image {
						data {
							attributes {
								...MediaFields
							}
						}
					}
					authorName
					authorLink
					platformName
					platformLink
					name
				}
			}
		}
		createdAt
	}
	${tagFields}
	${mediaFields}
`
