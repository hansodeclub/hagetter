import { types, flow, castFlowReturn } from 'mobx-state-tree';
import { Account } from '../utils/mastodon/types';
import cookie from 'js-cookie';
import { clearSession } from '../utils/auth';

// どっかにまとめる
const fetchProfile = async (token: string) => {
    const res = await fetch('/api/mastodon/profile', {
        headers: {
            Authorization: token
        }
    });

    // TODO: error handling (check error without response -> with error response)
    const data = await res.json();
    return data.data;
}

const SessionStore =
    types.model('SessionModel', {
        initializing: types.optional(types.boolean, true),
        loading: types.optional(types.boolean, false),
        account: types.optional(types.frozen<Account>(), null)
    }).actions(self => {
        const getAccount = flow(function* () {
            if (self.loading) return null;

            self.initializing = false;
            self.loading = true;
            // challenge to getProfile
            // 1. session
            // 2. localStorage(JSON)
            // 3. fetch from mastodon API (use Cookie accesstoken)
            if (self.account) {
                self.loading = false;
                return self.account;
            }

            const localStorageAccount = window.localStorage.getItem('profile');
            if (localStorageAccount && localStorageAccount !== 'undefined' && localStorageAccount !== 'null') {
                const account = JSON.parse(localStorageAccount);
                self.account = account;
                self.loading = false;
                return self.account;
            }

            const token = cookie.get('token');
            if (token) {
                self.account = yield fetchProfile(token);
                window.localStorage.setItem('profile', JSON.stringify(self.account));
                self.loading = false;
                return castFlowReturn(self.account);
            }

            self.loading = false;
            return null;
        })

        const logout = () => {
            clearSession();
            self.account = null;
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

        return { getAccount, logout }
    });


export default SessionStore;