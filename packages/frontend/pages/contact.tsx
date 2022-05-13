import { Page } from "components/common/layout/layout.atoms"
import { Contact as ContactInfo } from "components/Contact"
import { Navigation } from "components/navigation"
import Head from "next/head"

const Contact = () => {
	return (
		<div>
			<Head>
				<title>Contact | André Vital</title>
			</Head>
			<Navigation />
			<Page>
				<ContactInfo />
			</Page>
		</div>
	)
}

export default Contact
