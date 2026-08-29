import type { MDXComponents } from "mdx/types"

// Headings, links and code blocks render with their browser defaults;
// rehype-pretty-code styles <pre> and <code> through data attributes, so no
// wrapper is needed here. Interactive components used inside Craft pieces and
// posts get added to this map as they are built.
export const mdxComponents: MDXComponents = {}
