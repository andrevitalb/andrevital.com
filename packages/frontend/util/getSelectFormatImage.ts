import { Media } from "lib/fragments/media.fragment"

export const getBiggestFormatImage = (formats: Media["formats"]) =>
	formats.large ?? formats.medium ?? formats.small

export const getSmallestFormatImage = (formats: Media["formats"]) =>
	formats.small ?? formats.medium
