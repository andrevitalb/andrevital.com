import { CVProvider } from "contexts/CVContext"
import { ProjectsProvider } from "contexts/ProjectsContext"
import "styles/globals.css"
import { GlobalStyles } from "twin.macro"

export default function App<Props>({
	Component,
	pageProps,
}: {
	Component: React.ComponentType<Props>
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
