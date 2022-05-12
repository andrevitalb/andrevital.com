import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import { NotFound as NotFoundPage } from "components/NotFound"
import Head from "next/head"

const NotFound = () => {
	return (
		<div>
			<Head>
				<title>404 | André Vital</title>
			</Head>
			<Navigation />
			<Page>
				<NotFoundPage />
			</Page>
		</div>
	)
}

export default NotFound
