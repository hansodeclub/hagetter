import React from 'react'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import getHost from '../utils/getHost'
import Select from 'react-select'
import Header from '../components/Header'
import cookie from 'js-cookie'
import { InstanceDatastoreRepository } from '~/infrastructure/InstanceDatastoreRepository'
import { ListInstances } from '~/usecases/ListInstances'
import Box from '@material-ui/core/Box'
import { HagetterApiClient } from '~/utils/hage'

interface Props {
  code: number
  instances: string[]
  error?: Error
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const action = new ListInstances(new InstanceDatastoreRepository())

  try {
    const instances = await action.execute()

    return {
      props: {
        code: 200,
        instances,
        error: null,
      },
    }
  } catch (err) {
    return {
      props: {
        code: err.code ?? 500,
        instances: [],
        error: err.message,
      },
    }
  }
}

const LoginPage: NextPage<Props> = ({ instances, error }) => {
  const [instance, setInstance] = React.useState<{ label: string }>()

  React.useEffect(() => {
    const server = cookie.get('instance')
    if (server) {
      setInstance({ label: server })
    }
  }, [])

  const handleInstanceChange = (value) => {
    setInstance(value)
  }

  if (error) {
    return <p>{error}</p>
  }

  const servers = instances.map((instance) => ({ label: instance }))

  return (
    <div>
      <Head>
        <title>Hagetter - ログイン</title>
      </Head>
      <Header />
      <Container>
        <Box p={1}>
          <Typography>
            ログインするインスタンスを選択してください。
            <br />
          </Typography>
          <div style={{ maxWidth: 500 }}>
            <Select
              options={servers}
              value={instance}
              onChange={handleInstanceChange}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={() => onClickButton(instance.label)}
          >
            認証
          </Button>
        </Box>
      </Container>
    </div>
  )
}

const onClickButton = async (instanceName: string) => {
  const redirect_uri = encodeURIComponent(`${getHost(window)}/callback`)
  cookie.set('instance', instanceName)

  const client = new HagetterApiClient()

  const { server, client_id, client_secret } = await client.getInstanceInfo(
    instanceName
  )

  //await getInstanceInfo(
  //instanceName
  //)
  location.href = `${server}/oauth/authorize?response_type=code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`
}

/*
Login.getInitialProps = async (ctx) => {
    try {
        const { protocol, host } = getUrlHost(ctx.req, null);
        return await getInstanceList(protocol, host);
    } catch (err) {
        console.error(err);
        return { error: err as Error, instances: [] as string[] } as Props;
    }
}*/

export default LoginPage
