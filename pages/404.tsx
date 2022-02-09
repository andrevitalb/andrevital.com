import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import Head from "next/head"

const NotFound = () => {
	return (
		<div>
			<Head>
				<title>404 | André Vital</title>
			</Head>
			<Navigation />
			<Page></Page>
		</div>
	)
}

export default NotFound
