//https://github.com/mui-org/material-ui/blob/master/examples/nextjs
import React, { useEffect } from 'react'

import { CacheProvider, EmotionCache } from '@emotion/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import ErrorNotification from '@/components/ErrorNotification'

import createEmotionCache from '@/lib/createEmotionCache'
import { analytics, logEvent } from '@/lib/firebase/client'
import { StoreProvider, useSession } from '@/stores'
import '@/styles.scss'
import theme from '@/theme'

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
        url: url,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Hagetter</title>
        <meta property="og:site_name" content="Hagetter" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
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
