import { Page } from "components/common/layout/layout.atoms"
import { NotFound as NotFoundPage } from "components/NotFound"
import Head from "next/head"

const NotFound = () => {
	return (
		<div>
			<Head>
				<title>404 | André Vital</title>
			</Head>
			<Page>
				<NotFoundPage />
			</Page>
		</div>
	)
}

export default NotFound
