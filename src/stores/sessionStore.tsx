import { types, flow } from 'mobx-state-tree'
import { Account } from '../utils/mastodon/types'
import jwt from 'jsonwebtoken'

import {
  initSession,
  clearSession,
  getToken,
  getProfile,
} from '../utils/auth/client'
import { fetchProfile } from '../utils/hage'

const SessionStore = types
  .model('SessionModel', {
    id: types.identifier,
    initializing: types.optional(types.boolean, true),
    loading: types.optional(types.boolean, false),
    account: types.optional(types.frozen<Account>(), null),
  })
  .views((self) => ({
    get loggedIn() {
      if(typeof window !== 'undefined') {
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
      const account = yield fetchProfile(jwtToken)
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
