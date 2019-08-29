import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import './App.scss';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Hidden from '@material-ui/core/Hidden';
import { useStore } from '../stores';
import MatomeList from '../components/matome/MatomeList';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import BorderedBox from '../components/BorderedBox';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      minWidth: 1000
    },
    gridContainer: {
      height: '100vh',
      overflow: 'hidden',
      paddingTop: 10,
      boxSizing: 'border-box'
    },
    gridColumn: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  })
);

const Home = () => {
  const classes = useStyles({});
  const app = useStore();

  return (
    <div>
      <Head>
        <title>Hagetter</title>
      </Head>
      <Header />
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Hidden xsDown>
            <Grid item>
              <BorderedBox style={{ flexGrow: 1, maxWidth: 400 }}>
                <img
                  src="/static/donmi_kusa_semai.png"
                  style={{ width: '100%' }}
                />
              </BorderedBox>
            </Grid>
          </Hidden>
          <Grid item>
            <BorderedBox style={{ width: 500 }}>
              <MatomeList />
            </BorderedBox>
          </Grid>
        </Grid>
        <button onClick={() => app.notifyError(new Error('testError'))}>
          Error
        </button>
      </Container>
    </div>
  );
};

export default Home;
