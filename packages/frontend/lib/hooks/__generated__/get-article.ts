/* eslint-disable */
/* This is an autogenerated file. Do not edit this file directly! */
import { TypedQueryDocumentNode } from "graphql";
export type GetArticle = {
    articles: ({
        data: ({
            id: string | null;
            attributes: (ArticleFields) | null;
        })[];
    }) | null;
};
export type GetArticleVariables = {
    slug?: string | null;
};
export type GetArticleDocument = TypedQueryDocumentNode<GetArticle, GetArticleVariables>;
export type ArticleFields = {
    slug: string;
    title: string;
    content: string | null;
    tags: ({
        data: ({
            id: string | null;
            attributes: (TagFields) | null;
        })[];
    }) | null;
    thumbnail: {
        data: ({
            attributes: (MediaFields) | null;
        }) | null;
    };
    createdAt: any | null;
};
export type TagFields = {
    tagId: string;
    value: string | null;
    category: ("develop" | "photo") | null;
};
export type MediaFields = {
    name: string;
    url: string;
    formats: any | null;
};