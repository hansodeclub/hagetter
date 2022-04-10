import head from '~/utils/head'
import { withApiMasto, transformStatus } from '~/utils/api/server'

export default withApiMasto(async ({ req, res, user, client }) => {
  const timeline = await client.getPublicTimeline({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  return transformStatus(timeline.data as any, instance)
})
