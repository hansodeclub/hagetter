import { transformStatus, withApiMasto } from '@/lib/api/server'
import head from '@/lib/head'

export default withApiMasto(async ({ req, user, client }) => {
  const timeline = await client.getFavourites({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  return transformStatus(timeline.data as any, instance)
})
