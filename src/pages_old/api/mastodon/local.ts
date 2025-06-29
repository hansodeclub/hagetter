import { transformStatus, withApiMasto } from '@/features/api/server'
import head from '@/lib/utils/head'

export default withApiMasto(async ({ req, res, user, accessToken, client }) => {
  const timeline = await client.getLocalTimeline({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  return { data: transformStatus(timeline.data as any, instance) }
})
