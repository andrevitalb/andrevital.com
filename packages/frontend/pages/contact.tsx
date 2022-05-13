import { Page, PageContentWrapper } from "components/common/layout/layout.atoms"
import { Contact as ContactInfo } from "components/Contact"
import Head from "next/head"

const Contact = () => {
	return (
		<div>
			<Head>
				<title>Contact | André Vital</title>
			</Head>
			<Page>
				<PageContentWrapper>
					<ContactInfo />
				</PageContentWrapper>
			</Page>
		</div>
	)
}

export default Contact
