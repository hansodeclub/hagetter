import * as React from 'react'
import Head from 'next/head'
import Header from '~/components/Header'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Hidden from '@mui/material/Hidden'
import MatomeList from '~/components/matome/MatomeList'
import BorderedBox from '~/components/BorderedBox'
import { SxProps, Theme } from '@mui/material/styles'

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    paddingTop: 1,
  },
  gridContainer: {
    height: '100vh',
    overflow: 'hidden',
    paddingTop: 1,
    boxSizing: 'border-box',
  },
  gridColumn: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}

const PC = () => {
  return (
    <Container sx={styles.container}>
      <Grid container spacing={2}>
        <Hidden xsDown>
          <Grid item>
            <BorderedBox style={{ flexGrow: 1, maxWidth: 300 }}>
              <img src="/donmi_kusa_semai.png" style={{ width: '100%' }} />
            </BorderedBox>
          </Grid>
        </Hidden>
        <Grid item>
          <BorderedBox style={{ minWidth: 300, flexShrink: 0 }}>
            <MatomeList />
          </BorderedBox>
        </Grid>
      </Grid>
    </Container>
  )
}

const Mobile = () => (
  <div style={{ borderBottom: '1px solid #888' }}>
    <MatomeList />
  </div>
)

const Home = () => {
  const wideMonitor = useMediaQuery('(min-width:667px)')
  //const wideMonitor = useMediaQuery(theme => theme.breakpoints.up('sm'));

  return (
    <div>
      <Head>
        <title>Hagetter</title>
      </Head>
      <Header />

      {wideMonitor && <PC />}
      {!wideMonitor && <Mobile />}
    </div>
  )
}

export default Home
