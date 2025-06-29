import { transformStatus, withApiMasto } from '@/features/api/server'

export default withApiMasto(async ({ req, res, user, accessToken, client }) => {
  if (req.method !== 'POST') {
    throw Error('Invalid method')
  }

  const [_, instance] = user.split('@')

  const urls = req.body['urls']
  const ids: string[] = []
  urls.forEach((url) => {
    const match = url.match(
      `https://${instance.replace('.', '\\.')}/.*/(\\d*)$`
    )
    if (match) {
      ids.push(match[1])
    }
  })

  const result: any[] = []
  for (const id of ids) {
    const status = await client.getStatus(id)
    // const status = await masto.statuses.fetch(id)
    result.push(status.data)
  }

  return { data: transformStatus(result, instance) }
})
