import { Page } from "components/common/layout/layout.atoms"
import { HomeBanner } from "components/HomeBanner"
import { Navigation } from "components/navigation"
import Head from "next/head"

export default function Home() {
	const title = "André Vital | Software Developer / Photographer"
	const description =
		"I'm André Vital, a software developer doubling as photographer when away from the keyboard."
	const siteScreenShot = "https://www.andrevital.com/images/sitess.jpg"
	return (
		<div>
			<Head>
				<title>{title}</title>
				<meta charSet="utf-8" />
				<meta name="theme-color" content="#000" />
				<meta name="title" content={title} />
				<meta name="application-name" content="André Vital" />
				<meta name="description" content={description} />
				<meta name="author" content="André Vital" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>

				{/* Facebook */}
				<meta property="og:site_name" content="André Vital" />
				<meta property="og:title" content={title} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://www.andrevital.com/" />
				<meta property="og:image" content={siteScreenShot} />
				<meta property="og:description" content={description} />

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:url"
					content="https://www.andrevital.com/"
				/>
				<meta property="twitter:title" content={title} />
				<meta property="twitter:description" content={description} />
				<meta property="twitter:image" content={siteScreenShot} />
				<meta name="twitter:image:alt" content={title} />
				<meta name="twitter:site" content="@andrevitalb" />
			</Head>
			<Navigation />
			<Page>
				<HomeBanner />
			</Page>
		</div>
	)
}
