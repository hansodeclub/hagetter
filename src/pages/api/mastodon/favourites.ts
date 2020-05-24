import head from '../../../utils/head'
import {
  globalizeAcct,
  withApiMasto,
  preprocessMastodonStatus,
} from '../../../utils/api/server'

export default withApiMasto(async ({ req, user, masto }) => {
  const timeline = await masto.fetchFavourites({
    max_id: head(req.query.max_id),
  })

  const [_, instance] = user.split('@')
  for await (const statuses of timeline) {
    return preprocessMastodonStatus(statuses, instance)
  }
})
