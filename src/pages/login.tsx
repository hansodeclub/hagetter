import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import getHost from '../utils/getHost';
import fetch from 'isomorphic-unfetch';
import Select from 'react-select';
import Header from '../components/Header';
import cookie from 'js-cookie';
import { getInstanceInfo, getInstanceList } from '../utils/hage';
import { getUrlHost } from '../utils/api/utils';


const onClickButton = async (instanceName: string) => {
    const redirect_uri = encodeURIComponent(`${getHost(window)}/callback`);
    cookie.set('instance', instanceName);
    const { server, client_id, client_secret } = await getInstanceInfo(instanceName);
    location.href = `${server}/oauth/authorize?response_type=code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`;
}


interface Props {
    instances: [string]
    error?: Error
}

const Login: NextPage<Props> = ({ instances }) => {
    const [instance, setInstance] = React.useState<{ label: string }>();

    React.useEffect(() => {
        const server = cookie.get('instance');
        if (server) {
            setInstance({ label: server });
        }
    }, []);

    const handleInstanceChange = (value) => {
        setInstance(value);
    }

    const servers = instances.map(instance => ({ label: instance }));

    return (
        <div>
            <Head>
                <title>Hagetter - ログイン</title>
            </Head>
            <Header />
            <Container>
                <Typography>
                    ログインするインスタンスのドメインを選択してください。<br />
                </Typography>
                <div style={{ maxWidth: 500 }}>
                    <Select options={servers} value={instance} onChange={handleInstanceChange} />
                </div>
                <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={() => onClickButton(instance.label)} >認証</Button>
            </Container>
        </div>)
}



Login.getInitialProps = async (ctx) => {
    try {
        const { protocol, host } = getUrlHost(ctx.req, null);
        return await getInstanceList(protocol, host);
    } catch (err) {
        console.error(err);
        return { error: err as Error, instances: [] as string[] } as Props;
    }
}

export default Login;
