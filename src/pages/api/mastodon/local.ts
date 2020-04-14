import { withApiMasto } from '../../../utils/api/server'
import head from '../../../utils/head'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const timeline = await masto.fetchCommunityTimeline({
    max_id: head(req.query.max_id)
  })
  for await (const statuses of timeline) {
    return statuses
  }
})
