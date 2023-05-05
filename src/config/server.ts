export const serverConfig = {
  mastodonServer: process.env.MASTODON_SERVER,
  clientKey: process.env.CLIENT_KEY,
  clientSecret: process.env.CLIENT_SECRET,
  encryptKey: process.env.ENCTYPT_KEY,
  jwtSecret: process.env.JWT_SECRET,
  cloudFlareApiToken: process.env.CLOUDFLARE_API_TOKEN,
  cloudFlareZoneId: process.env.CLOUDFLARE_ZONE_ID,
  algoliaAppId: process.env.ALGOLIA_APP_ID,
  algoliaApiKey: process.env.ALGOLIA_API_KEY,
}

const errors = Object.entries(serverConfig).reduce((acc, [key, value]) => {
  if (!value) {
    acc.push(key)
  }

  return acc
}, [] as string[])

if (errors.length > 0) {
  throw Error(`Missing environment variables: ${errors.join(', ')}`)
}

export default serverConfig
