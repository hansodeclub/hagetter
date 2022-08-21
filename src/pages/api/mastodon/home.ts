import { transformStatus, withApiMasto } from '@/lib/api/server'
import head from '@/lib/head'

export default withApiMasto(async ({ req, res, user, accessToken, client }) => {
  const timeline = await client.getHomeTimeline({
    max_id: head(req.query.max_id),
  })

  console.log(timeline.data.map((t) => t.reblog))

  const [_, instance] = user.split('@')
  return transformStatus(timeline.data as any, instance)
})
