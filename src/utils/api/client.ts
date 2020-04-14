//import {Response, ErrorInfo} from './types';
import cookie from 'js-cookie'

export interface RequestOptions {
  token?: string
  method?: string
}

export const request = async (path: string, options: RequestOptions = {}) => {
  const headers = options.token
    ? {
      Authorization: `Bearer ${options.token}`
    }
    : {}

  const res = await fetch(path, {
    method: options.method ?? 'GET',
    headers
  })

  if (res.status === 200) {
    return await res.json()
  } else {
    throw Error('API error')
  }
}
