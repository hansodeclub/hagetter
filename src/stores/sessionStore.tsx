import { types, flow } from 'mobx-state-tree'
import { Account } from '../utils/mastodon/types'
import {
  initSession,
  clearSession,
  getToken,
  getProfile,
} from '../utils/auth/client'

// どっかにまとめる
const fetchProfile = async (token: string) => {
  const res = await fetch('/api/mastodon/profile', {
    headers: {
      Authorization: token,
    },
  })

  // TODO: error handling (check error without response -> with error response)
  const data = await res.json()
  return data.data
}

const SessionStore = types
  .model('SessionModel', {
    id: types.identifier,
    initializing: types.optional(types.boolean, true),
    loading: types.optional(types.boolean, false),
    account: types.optional(types.frozen<Account>(), null),
  })
  .views((self) => ({
    get loggedIn() {
      return window.localStorage.getItem('token') !== null
    },
    get token() {
      return getToken()
    },
  }))
  .actions((self) => {
    const getAccount = flow(function* () {
      if (self.loading) return null
      self.initializing = false
      // challenge to getProfile
      // 1. session
      // 2. localStorage(JSON)
      // 3. fetch from mastodon API (use Cookie accesstoken)

      if (self.account) {
        return self.account
      }

      const jwtToken = getToken()
      //const token = cookie.get('token');

      // Login check
      if (!jwtToken) {
        return null // Not logged in
      }

      const localStorageAccount = getProfile() //window.localStorage.getItem('profile');
      if (localStorageAccount) {
        //const account = JSON.parse(localStorageAccount);
        self.account = localStorageAccount as Account
        return self.account
      }

      // fetch profile via Mastodon API
      self.loading = true
      const account = yield fetchProfile(jwtToken)
      setAccount(account)
      //window.localStorage.setItem('profile', JSON.stringify(self.account));
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
    /*,
        logout: () => {
            // 1. AccessKeyをrevokeする
            // 1. Cookie消す
            // 2. Local Storage消す
        },
        loggedIn() {
            return self.account !== undefined;
        } */

    return { getAccount, login, logout, setAccount }
  })

export default SessionStore
