import { ServerResponse } from 'http'

const cf = require('cloudflare')({
  token: process.env.CLOUDFLARE_API_TOKEN,
})

export const sendCacheControl = (res: ServerResponse) => {
  res.setHeader('CDN-Cache-Control', `max-age=${3600 * 24 * 30}`)
  res.setHeader('Cache-control', 'public, max-age=0')
}

export const purgeCache = async (urls: string[]) => {
  try {
    const response = await cf.zones.purgeCache(process.env.CLOUDFLARE_ZONE, {
      files: urls,
    })

    if (!response.success) {
      console.error(response.errors)
    }
  } catch (err) {
    console.error('Unable to purge cache')
    console.error(err)
  }
}
