import { withApiMasto, preprocessMastodonStatus } from '~/utils/api/server'
import head from '~/utils/head'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const timeline = masto.timelines.getPublicIterable({
    local: true,
    maxId: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  for await (const statuses of timeline) {
    return preprocessMastodonStatus(statuses, instance)
  }
})
