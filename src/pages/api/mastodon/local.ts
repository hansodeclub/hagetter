import { withApiMasto, transformStatus } from '~/utils/api/server'
import head from '~/utils/head'

export default withApiMasto(async ({ req, res, user, accessToken, client }) => {
  const timeline = await client.getLocalTimeline({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  return transformStatus(timeline.data as any, instance)
})
