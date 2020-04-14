import head from '../../../utils/head'
import { globalizeAcct, withApiMasto } from '../../../utils/api/server'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const timeline = await masto.fetchFavourites({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  for await (const statuses of timeline) {
    return globalizeAcct(statuses, instance)
  }
})
