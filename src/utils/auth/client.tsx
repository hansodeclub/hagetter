// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/auth.js

import { Component } from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import { Account } from '../mastodon/types';

export const initSession = (user: string, token: string) => {
  cookie.remove('token'); // remove old implementation's token
  window.localStorage.setItem('user', user);
  window.localStorage.setItem('token', token);
  window.localStorage.removeItem('profile');
};

export const clearSession = () => {
  cookie.remove('token');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now().toString());
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('profile');
};

export const getToken = (): string | null => {
  return window.localStorage.getItem('token');
};

export const getProfile = (): Account | null => {
  const profile = window.localStorage.getItem('profile');
  if (profile) {
    // Deal with bug
    if (profile === 'undefined' || profile === 'null') {
      console.warn(`profile is ${profile}`);
      window.localStorage.removeItem('profile');
      return null;
    }

    return JSON.parse(profile) as Account;
  }

  return null;
};

export const clearProfile = () => {
  window.localStorage.removeItem('profile');
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component) =>
  Component.displayName || Component.name || 'Component';

export function withAuthSync(WrappedComponent) {
  return class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const token = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token };
    }

    constructor(props) {
      super(props);

      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener('storage', this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout);
      window.localStorage.removeItem('logout');
    }

    syncLogout(event) {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        Router.push('/login');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

/*
// どっかにまとめる
const fetchProfile = async (token: string) => {
    const res = await fetch('/api/mastodon/profile', {
        headers: {
            Authorization: token
        }
    });

    // TODO: error handling (check error without response -> with error response)
    const data = await res.json();
    console.log(data);
    return data.data;
}

export const getAccount = async (): Promise<Account | null> => {//TODO: ctxの型調べる
    const localStorageAccount = window.localStorage.getItem('profile');
    console.log('localStorage', localStorageAccount);
    if (localStorageAccount) {
        const account = JSON.parse(localStorageAccount);
        return account;
    }

    const token = cookie.get('token');
    console.log('Cookie', token);
    if (token) {
        const account = await fetchProfile(token);
        window.localStorage.setItem('profile', JSON.stringify(account));
        return account;
    }

    console.log('ログインしてない');
    return null;
} */

export function auth(ctx) {
  const { token } = nextCookie(ctx);

  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push('/login');
  }

  return token;
}
