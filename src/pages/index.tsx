import React from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import './App.scss'
//import { useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Hidden from '@material-ui/core/Hidden'
import { useStore } from '../stores'
import MatomeList from '../components/matome/MatomeList'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import BorderedBox from '../components/BorderedBox'

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      paddingTop: 10,
    },
    gridContainer: {
      height: '100vh',
      overflow: 'hidden',
      paddingTop: 10,
      boxSizing: 'border-box',
    },
    gridColumn: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
  })
)

const PC = () => {
  const classes = useStyles({})
  const app = useStore()

  return (
    <Container className={classes.container}>
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
  const classes = useStyles({})
  const wideMonitor = useMediaQuery('(min-width:10px)')
  //const wideMonitor = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const app = useStore()

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
