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

const Home = () => {
  const store = useStore();
  return (
    <div>
      <Head>
        <title>Hagetter</title>
      </Head>
      <Header />
      <Container>
        <div style={{ display: 'flex' }}>
          <Hidden xsDown>
            <div style={{ flexGrow: 1 }}>
              <img src="/static/donmi_kusa.png" style={{ width: '100%' }} />
            </div>
          </Hidden>
          <div style={{ width: 500, border: '1px solid red' }}>
            <MatomeList />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
