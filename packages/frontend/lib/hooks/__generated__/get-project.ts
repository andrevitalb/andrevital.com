/* eslint-disable */
/* This is an autogenerated file. Do not edit this file directly! */
import { TypedQueryDocumentNode } from "graphql";
export type GetProject = {
    projects: ({
        data: ({
            id: string | null;
            attributes: (ProjectFields) | null;
        })[];
    }) | null;
};
export type GetProjectVariables = {
    projectId?: string | null;
};
export type GetProjectDocument = TypedQueryDocumentNode<GetProject, GetProjectVariables>;
export type ProjectFields = {
    projectId: string;
    name: string;
    description: string;
    category: ("develop" | "photo") | null;
    tags: ({
        data: ({
            id: string | null;
            attributes: (TagFields) | null;
        })[];
    }) | null;
    externalUrl: string | null;
    galleryAssets: ({
        data: ({
            attributes: (AssetFields) | null;
        })[];
    }) | null;
    accentColor: string;
    thumbnail: {
        data: ({
            attributes: (MediaFields) | null;
        }) | null;
    };
    logo: {
        data: ({
            attributes: (MediaFields) | null;
        }) | null;
    };
};
export type TagFields = {
    tagId: string;
    value: string | null;
    category: ("develop" | "photo") | null;
};
export type AssetFields = {
    assetId: number;
    assetSlug: string;
    artist: string | null;
    media: {
        data: ({
            attributes: (MediaFields) | null;
        }) | null;
    };
};
export type MediaFields = {
    name: string;
    url: string;
    formats: any | null;
};
