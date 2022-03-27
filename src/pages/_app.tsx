//https://github.com/mui-org/material-ui/blob/master/examples/nextjs

import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '~/theme'
import { StoreProvider, useSession } from '~/stores'
import { analytics, logEvent} from '~/utils/firebase/client'
import ErrorNotification from '~/components/ErrorNotification'
import createEmotionCache from '~/utils/createEmotionCache'
import '~/styles.scss'
require('setimmediate')

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      logEvent(analytics, 'pageview', {
        url: url
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const fonts = [
    'https://fonts.googleapis.com/css?family=Roboto+Condensed:700|Work+Sans:300,400&display=swap',
  ]

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Hagetter</title>
        <meta property="og:site_name" content="Hagetter" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {fonts.map((font) => (
          <link rel="stylesheet" href={font} key={font} />
        ))}
      </Head>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MyComponent {...props} />
          <ErrorNotification />
        </ThemeProvider>
      </StoreProvider>
    </CacheProvider>
  )
}

const MyComponent = ({ Component, pageProps }) => {
  const session = useSession()
  React.useEffect(() => {
    // useEffect内はクライアントサイドで呼ばれる
    session
      .getAccount()
      .then((account) => {})
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return <Component {...pageProps} />
}
