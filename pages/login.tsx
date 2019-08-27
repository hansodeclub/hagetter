import React from 'react'
import Head from 'next/head'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import getHost from '../utils/getHost';

import Header from '../components/Header';

const onClickButton = () => {
    const server = process.env.MASTODON_SERVER;
    const client_id = process.env.CLIENT_KEY;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = encodeURIComponent(`${getHost(window)}/api/redirect`);
    location.href = `${server}/oauth/authorize?response_type=code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`;
}

const Login = () => (
    <div>
        <Head>
            <title>Hagetter - ログイン</title>
        </Head>
        <Header />
        <Container>
            <Typography>
                handon.clubで認証します。<br />
                (現在他のインスタンスは未対応です。)
            </Typography>
            <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={onClickButton}>認証</Button>
        </Container>
    </div>
)

export default Login;
