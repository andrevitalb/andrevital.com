import { gql } from "@apollo/client"

export interface MediaFormatProps {
	ext: string
	url: string
	hash: string
	mime: string
	name: string
	path: string | null
	size: number
	width: number
	height: number
}

export interface MediaFormatsType {
	large?: MediaFormatProps
	medium?: MediaFormatProps
	small: MediaFormatProps
	thumbnail?: MediaFormatProps
}

export interface Media {
	name: string
	url: string
	formats: MediaFormatsType
}

export const mediaFields = gql`
	fragment MediaFields on UploadFile {
		name
		url
		formats
	}
`
