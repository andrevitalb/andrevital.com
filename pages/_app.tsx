import 'styles/globals.css'
import { GlobalStyles } from "twin.macro"

export default function App<Props>({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<Props>
  pageProps: Props
}) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}
