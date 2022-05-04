import { ApolloProvider, NormalizedCacheObject } from "@apollo/client"
import { CVProvider } from "contexts/CVContext"
import { ProjectsProvider } from "contexts/ProjectsContext"
import { useApollo } from "lib/apolloClient"
import "lightgallery/css/lightgallery.css"
import { ComponentType } from "react"
import "styles/globals.css"
import "styles/lightGallery.css"
import { GlobalStyles } from "twin.macro"

/**
 * The App component implicitly wraps every page component. This code runs
 * client-side and server-side.
 *
 * See https://nextjs.org/docs/advanced-features/custom-app
 */
export default function App<
	Props extends { initialApolloState?: NormalizedCacheObject },
>({
	Component,
	pageProps,
}: {
	Component: ComponentType<Props>
	pageProps: Props
}) {
	const apolloClient = useApollo(pageProps.initialApolloState)
	return (
		<ApolloProvider client={apolloClient}>
			<ProjectsProvider>
				<CVProvider>
					<GlobalStyles />
					<Component {...pageProps} />
				</CVProvider>
			</ProjectsProvider>
		</ApolloProvider>
	)
}
