import { withApiMasto, preprocessMastodonStatus } from '~/utils/api/server'
import head from '~/utils/head'

export default withApiMasto(async ({ req, user, masto }) => {
  const keyword = head(req.query.keyword)
  if (!keyword) {
    throw Error('keyword is not specified')
  }

  const timeline = masto.search({ q: keyword })

  const [_, instance] = user.split('@')
  for await (const tl of timeline) {
    return {
      ...tl,
      statuses: preprocessMastodonStatus(tl.statuses, instance),
    }
  }
})
