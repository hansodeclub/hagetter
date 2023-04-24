import { transformStatus, withApiMasto } from '@/features/api/server'
import head from '@/lib/utils/head'

export default withApiMasto(async ({ req, user, client }) => {
  const keyword = head(req.query.keyword)
  if (!keyword) {
    throw Error('keyword is not specified')
  }

  const timeline = await client.search(keyword, 'statuses')
  const [_, instance] = user.split('@')
  return { data: transformStatus(timeline.data.statuses, instance) }
})
