import head from '../../../utils/head'
import { withApiMasto } from '../../../utils/api/server'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const timeline = await masto.fetchHomeTimeline({
    max_id: head(req.query.max_id)
  })
  for await (const statuses of timeline) {
    return statuses
  }
})
