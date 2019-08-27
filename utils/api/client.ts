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