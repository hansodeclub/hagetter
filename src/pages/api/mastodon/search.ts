import { withApiMasto, transformStatus } from '~/utils/api/server'
import head from '~/utils/head'

export default withApiMasto(async ({ req, user, client }) => {
  const keyword = head(req.query.keyword)
  if (!keyword) {
    throw Error('keyword is not specified')
  }

  const timeline = await client.search(keyword, 'statuses')
  const [_, instance] = user.split('@')
  return transformStatus(timeline.data.statuses, instance)
})
