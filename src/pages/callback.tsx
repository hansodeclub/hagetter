import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import jwt from 'jsonwebtoken'
import Cookies from 'next-cookies'
import { useSession } from '~/stores'
import { getUrlHost } from '~/utils/api/utils'
import head from '~/utils/head'

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
    const instance = Cookies(context).__session
    const code = head(context.query.code)

    const res = await fetch(
      `${protocol}//${host}/api/login?instance=${instance}&code=${code}`
    )

    const json = await res.json()
    if (json.status === 'error') {
      return {
        props: {
          error: json.error.message,
        },
      }
    } else {
      return { props: { token: json.data.token, profile: json.data.profile } }
    }
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
