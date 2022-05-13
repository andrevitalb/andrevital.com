import { Page } from "components/common/layout/layout.atoms"
import { Contact as ContactInfo } from "components/Contact"
import Head from "next/head"

const Contact = () => {
	return (
		<div>
			<Head>
				<title>Contact | André Vital</title>
			</Head>
			<Page>
				<ContactInfo />
			</Page>
		</div>
	)
}

export default Contact
