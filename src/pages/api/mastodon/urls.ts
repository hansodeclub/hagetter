import { withApiMasto, preprocessMastodonStatus } from '~/utils/api/server'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
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
    const status = await masto.statuses.fetch(id)
    result.push(status)
  }

  return { statuses: preprocessMastodonStatus(result, instance) }
})

/*
export const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization
  if (!token) {
    throw Error('Invalid credentials')
  }

  const masto = await Masto.login({
    uri: process.env.MASTODON_SERVER,
    accessToken: token,
  })

  const urls = req.body['urls']
  console.log(req.body.urls)
  console.log(req.body)
  const ids = []
  urls.forEach((url) => {
    const match = url.match('https://handon.club/./(\\d*)$')
    if (match) {
      ids.push(match[1])
    }
  })

  console.log(ids)

  const result = []
  for (const id of ids) {
    const status = await masto.fetchStatus(id)
    result.push(status)
  }

  respondSuccess(res, { statuses: result })
}*/

/*
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await handlePost(req, res);
    } else {
      respondError(res, `Unknown method: ${req.method}`);
    }
  } catch (err) {
    console.error(err);
    respondError(res, err);
  }
}*/
