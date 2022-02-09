import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from "next/document"
import { ServerStyleSheet } from "styled-components"
/**
 * This custom Document class customizes server-side rendering and generation.
 * (Nothing here runs client side.) Customizations that should apply to every
 * page can be made here, like setting a `lang="en"` attribute on the `<Html>`
 * tag. But most <head> tag stuff, like setting a page title, should be handled
 * in page components (not here) using the `Head` tag imported from "next/head"
 * so that values can change during client-side page transitions.
 *
 * See https://nextjs.org/docs/advanced-features/custom-document
 */
export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet()
		const originalRenderPage = ctx.renderPage

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(<App {...props} />),
				})

			const initialProps = await Document.getInitialProps(ctx)
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="canonical" href="https://www.andrevital.com/" />

					{/* Favicon */}
					<link
						rel="icon"
						type="image/ico"
						href="%PUBLIC_URL%/assets/images/favicons/favicon.ico"
					/>
					<link
						rel="shortcut icon"
						href="%PUBLIC_URL%/assets/images/favicons/favicon.png"
					/>
					<link
						rel="apple-touch-icon"
						href="%PUBLIC_URL%/assets/images/favicons/apple-touch-icon-57x57.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="72x72"
						href="%PUBLIC_URL%/assets/images/favicons/apple-touch-icon-72x72.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="114x114"
						href="%PUBLIC_URL%/assets/images/favicons/apple-touch-icon-114x114.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="36x36"
						href="%PUBLIC_URL%/assets/images/favicons/android-chrome-36x36.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="48x48"
						href="%PUBLIC_URL%/assets/images/favicons/android-chrome-48x48.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="72x72"
						href="%PUBLIC_URL%/assets/images/favicons/android-chrome-72x72.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="96x96"
						href="%PUBLIC_URL%/assets/images/favicons/android-chrome-96x96.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="144x144"
						href="%PUBLIC_URL%/assets/images/favicons/android-chrome-144x144.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="192x192"
						href="%PUBLIC_URL%/assets/images/favicons/android-chrome-192x192.png"
					/>

					{/* FontAwesome */}
					<link
						rel="stylesheet"
						href="%PUBLIC_URL%/assets/css/all.min.css"
					/>

					{/* Google Fonts */}
					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="crossorigin"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
