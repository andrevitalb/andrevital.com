import { gql, useQuery } from "@apollo/client"
import { Asset } from "lib/fragments/asset.fragment"
import { Media } from "lib/fragments/media.fragment"
import { projectFields } from "lib/fragments/project.fragment"
import { Tag } from "lib/fragments/tag.fragment"
import { sortDataByMainId } from "util/sortDataById"
import { GetProject } from "./__generated__/get-project"

type ProjectDataType = NonNullable<
	NonNullable<GetProject["projects"]>["data"]
>[number]
export type ProjectEntityType = {
	id: NonNullable<ProjectDataType["id"]>
	attributes: NonNullable<ProjectDataType["attributes"]>
}
type GalleryAssetType = NonNullable<
	NonNullable<
		ProjectEntityType["attributes"]["galleryAssets"]
	>["data"][number]["attributes"]
>

export interface Project {
	id: number
	projectId: string
	name: string
	description?: string
	category: string
	tags: Tag[]
	externalUrl?: string
	galleryAssets: Asset[]
	thumbnail: Media
	accentColor: string
	logo: Media
}

export const getProjectQuery = gql`
	query GetProject($projectId: String) {
		projects(filters: { projectId: { eq: $projectId } }) {
			data {
				id
				attributes {
					...ProjectFields
				}
			}
		}
	}
	${projectFields}
` as import("./__generated__/get-project").GetProjectDocument

export function useProject(projectId?: string) {
	const { data: getProject } = useQuery(getProjectQuery, {
		variables: { projectId },
	})

	return getProject?.projects?.data?.flatMap((project: ProjectEntityType) =>
		projectAttributesMapper(project),
	)[0] as Project
}

export const projectAttributesMapper = ({
	id,
	attributes,
}: ProjectEntityType) => {
	const tags = !!attributes.tags
		? sortDataByMainId(attributes.tags.data).flatMap(({ attributes }) => ({
				...attributes,
			}))
		: []

	const galleryAssets = !!attributes?.galleryAssets
		? (attributes?.galleryAssets.data
				?.filter(({ attributes }) => !!attributes)
				.flatMap(({ attributes: galleryAsset }) => {
					return {
						...galleryAsset,
						media: { ...galleryAsset?.media.data?.attributes },
					}
				}) as GalleryAssetType[])
		: []

	const thumbnail = { ...attributes.thumbnail.data?.attributes }
	const logo = { ...attributes.logo.data?.attributes }

	return {
		...attributes,
		tags,
		galleryAssets: galleryAssets.sort(
			({ assetId: firstId }, { assetId: secondId }) => firstId - secondId,
		),
		thumbnail,
		logo,
		id,
	}
}
