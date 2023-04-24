import React from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Select from 'react-select'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import Header from '@/components/Header'

import { listInstances } from '@/features/instances/api'
import { InstanceInfo } from '@/features/instances/types'
import { HagetterApiClient } from '@/lib/hagetterApiClient'
import getHost from '@/lib/utils/url'

interface PageProps {
  code: number
  instances: InstanceInfo[]
  error?: Error
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  try {
    const instances = await listInstances()

    return {
      props: { code: 200, instances, error: null },
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

const LoginPage: NextPage<PageProps> = ({ instances, error }) => {
  const [instance, setInstance] = React.useState<InstanceInfo>()

  const handleInstanceChange = ({ value }: { value: InstanceInfo }) => {
    setInstance(value)
  }

  const selectOptions = instances.map((instance) => ({
    label: instance.name,
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
            <Select options={selectOptions} onChange={handleInstanceChange} />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={() => onClickButton(instance)}
          >
            認証
          </Button>
          {error && <p>{error}</p>}
        </Box>
      </Container>
    </div>
  )
}

const onClickButton = (instance?: InstanceInfo) => {
  if (!instance) return
  const client = new HagetterApiClient()
  const callbackUri = `${getHost(window)}/auth/${instance.id}`
  location.href = client.getOAuthUrl(instance, callbackUri)
}

export default LoginPage
