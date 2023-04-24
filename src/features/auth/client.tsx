// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/auth.js
import { Component } from 'react'

import cookie from 'js-cookie'
import jwt from 'jsonwebtoken'
import nextCookie from 'next-cookies'
import Router from 'next/router'

import { Account } from '@/features/posts/types/Status'

export const initSession = (user: string, token: string) => {
  cookie.remove('token') // remove old implementation's token
  window.localStorage.setItem('user', user)
  window.localStorage.setItem('token', token)
  window.localStorage.removeItem('profile')
}

export const clearSession = () => {
  cookie.remove('token')
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now().toString())
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('profile')
}

export const getToken = (): string | null => {
  const token = window.localStorage.getItem('token')
  if (!token) return null

  const exp = jwt.decode(token).exp * 1000
  const now = new Date().getTime()
  if (exp > now + 1000 * 60 * 60) {
    // JWTトークンの有効期限が1時間以上余っている時のみトークンを返す
    return token
  } else {
    clearSession()
    return null
  }
}

export const getProfile = (): Account | null => {
  const profile = window.localStorage.getItem('profile')
  if (profile) {
    // Deal with bug
    if (profile === 'undefined' || profile === 'null') {
      console.warn(`profile is ${profile}`)
      window.localStorage.removeItem('profile')
      return null
    }

    return JSON.parse(profile) as Account
  }

  return null
}

export const clearProfile = () => {
  window.localStorage.removeItem('profile')
}

// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component) =>
  Component.displayName || Component.name || 'Component'

export function withAuthSync(WrappedComponent) {
  return class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`

    static async getInitialProps(ctx) {
      const token = auth(ctx)

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, token }
    }

    constructor(props) {
      super(props)

      this.syncLogout = this.syncLogout.bind(this)
    }

    componentDidMount() {
      window.addEventListener('storage', this.syncLogout)
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout)
      window.localStorage.removeItem('logout')
    }

    syncLogout(event) {
      if (event.key === 'logout') {
        console.info('logged out from storage!')
        Router.push('/login')
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export function auth(ctx) {
  const { token } = nextCookie(ctx)

  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end()
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push('/login')
  }

  return token
}
