import { z } from 'zod'

const serverConfigSchema = z
  .object({
    MASTODON_SERVER: z.string(),
    CLIENT_KEY: z.string(),
    CLIENT_SECRET: z.string(),
    ENCRYPT_KEY: z.string(),
    JWT_SECRET: z.string(),
    CLOUDFLARE_API_TOKEN: z.string(),
    CLOUDFLARE_ZONE: z.string(),
    ALGOLIA_APP_ID: z.string(),
    ALGOLIA_API_KEY: z.string(),
  })
  .transform((obj) => {
    return {
      mastodonServer: obj.MASTODON_SERVER,
      clientKey: obj.CLIENT_KEY,
      clientSecret: obj.CLIENT_SECRET,
      encryptKey: obj.ENCRYPT_KEY,
      jwtSecret: obj.JWT_SECRET,
      cloudFlareApiToken: obj.CLOUDFLARE_API_TOKEN,
      cloudFlareZoneId: obj.CLOUDFLARE_ZONE,
      algoliaAppId: obj.ALGOLIA_APP_ID,
      algoliaApiKey: obj.ALGOLIA_API_KEY,
    }
  })

export type ServerConfig = z.infer<typeof serverConfigSchema>

export const serverConfig = serverConfigSchema.parse(process.env)

/*
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
*/
