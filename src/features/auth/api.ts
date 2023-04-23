import React from 'react'

import { Account } from '@/core/domains/post/Status'

import {
  clearSession,
  getProfile,
  getToken,
  saveProfile,
} from '@/lib/auth/client'
import { HagetterClient } from '@/lib/hagetterClient'

export interface Session {
  loading: boolean
  account: Account | null
}

export const useAuth = () => {
  const [session, setSession] = React.useState<Session>({
    loading: true,
    account: null,
  })

  React.useEffect(() => {
    const init = async () => {
      const account = await getAccount()
      setSession({ loading: false, account })
    }

    init()
  })

  const logout = () => {
    clearSession()
    setSession({ loading: false, account: null })
  }

  return {
    session,
    getToken,
    logout,
  }
}

export const getAccount = async () => {
  const jwtToken = getToken()

  // Login check
  if (!jwtToken) {
    return null
  }

  const localStorageAccount = getProfile()
  if (localStorageAccount) {
    return localStorageAccount
  }

  // fetch profile via Mastodon API
  const hagetterClient = new HagetterClient()
  const account = await hagetterClient.getAccount(jwtToken)
  saveProfile(account)

  return account
}
