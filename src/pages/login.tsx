import React from 'react'
import Head from 'next/head'

import { GetServerSideProps, NextPage } from 'next'

import cookie from 'js-cookie'
import nookies from 'nookies'
import Select from 'react-select'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from '~/components/Header'

import { InstanceFirestoreRepository } from '~/infrastructure/firestore/InstanceFirestoreRepository'
import { ListInstances } from '~/usecases/ListInstances'
import { HagetterApiClient } from '~/utils/hage'
import getHost from '~/utils/getHost'

interface Props {
  code: number
  instances: string[]
  lastInstance?: string
  error?: Error
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const action = new ListInstances(new InstanceFirestoreRepository())

  try {
    const instances = await action.execute()

    const lastInstance = nookies.get(ctx)?.instance

    return {
      props: {
        code: 200,
        instances,
        lastInstance,
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

const LoginPage: NextPage<Props> = ({ instances, error, lastInstance }) => {
  const [instance, setInstance] = React.useState<string | undefined>(
    lastInstance
  )

  const handleInstanceChange = (value) => {
    setInstance(value.label)
  }

  if (error) {
    return <p>{error}</p>
  }

  const servers = instances.map((instance) => ({
    label: instance,
    value: instance,
  }))

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
              value={{ label: instance }}
              onChange={handleInstanceChange}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={() => onClickButton(instance)}
          >
            認証
          </Button>
        </Box>
      </Container>
    </div>
  )
}

const onClickButton = async (instanceName: string) => {
  cookie.set('instance', instanceName)

  const client = new HagetterApiClient()
  const instanceInfo = await client.getInstanceInfo(instanceName)
  const callbackUri = encodeURIComponent(`${getHost(window)}/callback`)
  location.href = client.getOAuthUrl(instanceInfo, callbackUri)
}

export default LoginPage
