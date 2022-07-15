import { gql } from "@apollo/client"

export interface Tag {
	id: number
	tagId: string
	value: string
	category: string
}

export const tagFields = gql`
	fragment TagFields on Tag {
		tagId
		value
		category
	}
`
