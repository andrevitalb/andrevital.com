import { CVProvider } from "contexts/CVContext"
import { ProjectsProvider } from "contexts/ProjectsContext"
import "lightgallery/css/lightgallery.css"
import { ComponentType } from "react"
import "styles/globals.css"
import "styles/lightGallery.css"
import { GlobalStyles } from "twin.macro"

export default function App<Props>({
	Component,
	pageProps,
}: {
	Component: ComponentType<Props>
	pageProps: Props
}) {
	return (
		<ProjectsProvider>
			<CVProvider>
				<GlobalStyles />
				<Component {...pageProps} />
			</CVProvider>
		</ProjectsProvider>
	)
}
