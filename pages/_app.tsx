//https://github.com/mui-org/material-ui/blob/master/examples/nextjs

import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../utils/theme';
import { StoreProvider } from '../stores';
import ErrorNotification from '../components/ErrorNotification';

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>Hagetter</title>
        </Head>
        <StoreProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
            <ErrorNotification />
          </ThemeProvider>
        </StoreProvider>
      </Container>
    );
  }
}

export default MyApp;
