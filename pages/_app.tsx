import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'
import Header from '../components/Header'
import GlobalStyles from '../styles/GlobalStyles'
import { ThemeName, themes, ThemeType } from '../styles/themes'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const themeName: ThemeName = 'main'
  const currentTheme: ThemeType = themes[themeName]

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <meta name="description" content="Your site description"></meta>
      </Head>
      <ThemeProvider theme={currentTheme}>
        <GlobalStyles />
        <Header />
        <Component {...pageProps} />
        {/* Your footer here*/}
      </ThemeProvider>
    </>
  )
}
