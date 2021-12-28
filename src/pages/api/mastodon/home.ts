import head from '~/utils/head'
import { withApiMasto, preprocessMastodonStatus } from '~/utils/api/server'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const timeline = await masto.timelines.getHomeIterable({
    maxId: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  for await (const statuses of timeline) {
    return preprocessMastodonStatus(statuses, instance)
  }
})
