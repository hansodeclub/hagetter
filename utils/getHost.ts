// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/get-host.js

// TODO:
// This is not production ready, (except with providers that ensure a secure host, like Now)
// For production consider the usage of environment variables and NODE_ENV
function getHost(req) {
    if (!req) return ''

    let host;
    if (req.headers) {
        host = req.headers.host;
    } else if (req.location) {
        host = req.location.host;
    } else {
        throw Error('getHost: Unknown parameter');
    }

    if (host.startsWith('localhost')) {
        return `http://${host}`
    }
    return `https://${host}`
}

export default getHost;