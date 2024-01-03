import { IncomingMessage } from 'http'

export const getUrlHost = (
  req: IncomingMessage,
  localhostDomain: string | undefined
) => {
  let protocol = 'https:'
  let host = (req ? req.headers.host : window.location.host) as string
  if (host.indexOf('localhost') > -1) {
    if (localhostDomain) host = localhostDomain
    protocol = 'http:'
  }

  return {
    protocol: protocol,
    host: host,
  }
}

// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/get-host.js

// TODO:
// This is not production ready, (except with providers that ensure a secure host, like Now)
// For production consider the usage of environment variables and NODE_ENV
export const getHost = (req: any) => {
  if (!req) return ''

  let host
  if (req.headers) {
    // server side
    host = req.headers.host
  } else if (req.location) {
    // client side
    host = req.location.host
  } else {
    throw Error('getHost: Unknown parameter')
  }

  if (
    host.startsWith('localhost') ||
    host.startsWith('10.') ||
    host.startsWith('192.')
  ) {
    return `http://${host}`
  }
  return `https://${host}`
}

export default getHost
