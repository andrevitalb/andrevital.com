import { ApolloProvider, NormalizedCacheObject } from "@apollo/client"
import { Navigation } from "components/navigation"
import { PageAnimationWrapper } from "components/PageAnimationWrapper"
import { useApollo } from "lib/apolloClient"
import "lightgallery/css/lg-thumbnail.css"
import "lightgallery/css/lg-zoom.css"
import "lightgallery/css/lightgallery.css"
import { Router } from "next/router"
import { ComponentType } from "react"
import "styles/globals.css"
import "styles/lightGallery.css"
import "styles/splashScreen.css"
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
	router,
}: {
	Component: ComponentType<Props>
	pageProps: Props
	router: Router
}) {
	const apolloClient = useApollo(pageProps.initialApolloState)
	return (
		<ApolloProvider client={apolloClient}>
			<GlobalStyles />
			<Navigation />
			<PageAnimationWrapper routerKey={router.route}>
				{/* 
					Same issue caused by @types/react.
					@see https://github.com/vercel/next.js/issues/35986
				*/}
				{/* @ts-ignore */}
				<Component {...pageProps} />
			</PageAnimationWrapper>
		</ApolloProvider>
	)
}
