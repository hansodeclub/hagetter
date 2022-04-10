import head from '~/utils/head'
import { withApiMasto, transformStatus } from '~/utils/api/server'

export default withApiMasto(async ({ req, user, client }) => {
  const timeline = await client.getFavourites({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  return transformStatus(timeline.data as any, instance)
})
