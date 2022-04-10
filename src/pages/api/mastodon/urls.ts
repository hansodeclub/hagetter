import { withApiMasto, transformStatus } from '@/utils/api/server'

export default withApiMasto(
  async ({ req, res, user, accessToken, client, masto }) => {
    if (req.method !== 'POST') {
      throw Error('Invalid method')
    }

    const [_, instance] = user.split('@')

    const urls = req.body['urls']
    const ids = []
    urls.forEach((url) => {
      const match = url.match(
        `https://${instance.replace('.', '\\.')}/.*/(\\d*)$`
      )
      if (match) {
        ids.push(match[1])
      }
    })

    const result = []
    for (const id of ids) {
      const status = await client.getStatus(id)
      // const status = await masto.statuses.fetch(id)
      result.push(status.data)
    }

    return transformStatus(result, instance)
  }
)
