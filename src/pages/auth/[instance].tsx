import * as React from 'react'

import fetch from 'isomorphic-unfetch'
import jwt from 'jsonwebtoken'
import { GetServerSideProps, NextPage } from 'next'

import { getUrlHost } from '@/lib/api/utils'
import { login } from '@/lib/auth/server'
import getHost from '@/lib/getHost'
import head from '@/lib/head'
import { useSession } from '@/stores'

interface Props {
  token?: string
  error?: string
  profile?: any
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  try {
    const { protocol, host } = getUrlHost(context.req, null)
    const instance = head(context.query.instance)
    const code = head(context.query.code)

    if (instance === '' || code === '') throw Error('Invalid request')

    const redirectUri = `${getHost(context.req)}/auth/${instance}`
    const { token, profile } = await login(code, instance, redirectUri)
    return { props: { token, profile } }
  } catch (error) {
    console.error(error)
    return { props: { error: error.message } }
  }
}

const Page: NextPage<Props> = ({ token, profile, error }) => {
  const session = useSession()
  //const [user, setUser] = React.useState();

  React.useEffect(() => {
    if (!token) return
    const { user } = jwt.decode(token)
    session.login(user, token)
    session.setAccount(profile)
    // setUser(user);
    window.location.href = '/'
    //Router.push('/');
  }, [token])

  if (error) {
    return <p>ログインに失敗しました。({error})</p>
  }
  return <p>ログイン中...</p>
}

export default Page
