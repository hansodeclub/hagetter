import {Response, ErrorInfo} from './types';
import cookie from 'js-cookie';

export const request = async (path: string, withAuth: boolean = false) => {
  const token = cookie.get('token');
  if(withAuth && !token) {
    throw Error('Need Login');
  }

  const res = await fetch(path, {
    headers: {
      Authorization: token,
    }
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    throw Error('API error');
  }
}

export interface RequestOptions {
  auth?: boolean
  method?: string
}
export const request2 = async (path: string, options: RequestOptions) => {
  const token = cookie.get('token');
  if(options.auth && !token) {
    throw Error('Need Login');
  }

  const headers = options.auth ? {
    Authorization: token
  }: {}

  const res = await fetch(path, {
    method: options.method ? options.method : 'GET',
    headers: headers
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    throw Error('API error');
  }
}
