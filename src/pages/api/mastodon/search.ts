import { globalizeAcct, withApiMasto } from '../../../utils/api/server'
import head from '../../../utils/head'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const keyword = head(req.query.keyword)
  if (!keyword) {
    throw Error('keyword is not specified')
  }

  const timeline = await masto.search({ q: keyword })

  const [_, instance] = user.split('@')
  for await (const tl of timeline) {
    return {
      ...tl,
      statuses: globalizeAcct(tl.statuses, instance),
    }
  }
})
