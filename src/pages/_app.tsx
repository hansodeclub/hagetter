//https://github.com/mui-org/material-ui/blob/master/examples/nextjs

import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../utils/theme'
import { StoreProvider } from '../stores'
import ErrorNotification from '../components/ErrorNotification'
require('setimmediate')

export default function MyApp(props) {
  const { Component, pageProps } = props

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  })

  return (
    <>
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
          <Component {...pageProps} />
          <ErrorNotification />
        </ThemeProvider>
      </StoreProvider>
    </>
  )
}
