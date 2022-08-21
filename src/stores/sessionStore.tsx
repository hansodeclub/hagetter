import { flow, types } from 'mobx-state-tree'

import { Account } from '@/core/domains/post/Status'

import {
  clearSession,
  getProfile,
  getToken,
  initSession,
} from '@/lib/auth/client'
import { HagetterClient } from '@/lib/hagetterClient'

const SessionStore = types
  .model('SessionModel', {
    id: types.identifier,
    initializing: types.optional(types.boolean, true),
    loading: types.optional(types.boolean, false),
    account: types.optional(types.frozen<Account>(), null),
  })
  .views((self) => ({
    get loggedIn() {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem('token') !== null
      }

      return false
    },
    get token() {
      return getToken()
    },
  }))
  .actions((self) => {
    const getAccount = flow(function* () {
      if (self.loading) return null
      self.initializing = false

      const jwtToken = getToken()

      // Login check
      if (!jwtToken) {
        return null // Not logged in
      }

      // get Profile cache
      if (self.account) {
        return self.account
      }

      const localStorageAccount = getProfile()
      if (localStorageAccount) {
        self.account = localStorageAccount as Account
        return self.account
      }

      // fetch profile via Mastodon API
      self.loading = true
      const hagetterClient = new HagetterClient()
      const account = yield hagetterClient.getAccount(jwtToken) //fetchProfile(jwtToken)
      setAccount(account)
      self.loading = false
      return self.account
    })

    const login = (user: string, token: string) => {
      initSession(user, token)
    }

    const setAccount = (profile: Account) => {
      self.account = profile
      window.localStorage.setItem('profile', JSON.stringify(profile))
    }

    const logout = () => {
      clearSession()
      self.account = null
    }

    return { getAccount, login, logout, setAccount }
  })

export default SessionStore
