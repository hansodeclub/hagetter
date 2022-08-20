import { transformStatus, withApiMasto } from '@/lib/api/server'
import head from '@/lib/head'

export default withApiMasto(async ({ req, user, client }) => {
  const keyword = head(req.query.keyword)
  if (!keyword) {
    throw Error('keyword is not specified')
  }

  const timeline = await client.search(keyword, 'statuses')
  const [_, instance] = user.split('@')
  return transformStatus(timeline.data.statuses, instance)
})
