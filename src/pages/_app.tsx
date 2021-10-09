//https://github.com/mui-org/material-ui/blob/master/examples/nextjs

import React from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../utils/theme'
import { StoreProvider, useSession } from '~/stores'
import ErrorNotification from '../components/ErrorNotification'
import '../styles.scss'
require('setimmediate')

export default function MyApp(props) {
  //const { Component, pageProps } = props

  const fonts = [
    'https://fonts.googleapis.com/css?family=Roboto+Condensed:700|Work+Sans:300,400&display=swap',
  ]

  return (
    <>
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
    </>
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
