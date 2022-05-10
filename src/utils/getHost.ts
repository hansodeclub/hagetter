// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/get-host.js

// TODO:
// This is not production ready, (except with providers that ensure a secure host, like Now)
// For production consider the usage of environment variables and NODE_ENV
function getHost(req) {
  if (!req) return ''

  let host
  if (process.env.HOSTNAME) {
    console.log(`Host ${process.env.API_HOSTNAME}`)
    host = process.env.API_HOSTNAME
  } else if (req.headers) {
    // server side
    console.log(req.headers)
    if (req.headers['x-forwarded-host']) host = req.headers['x-forwarded-host']
    else host = req.headers.host
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
