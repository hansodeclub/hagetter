import parseLinkHeader from 'parse-link-header'

import { transformStatus, withApiMasto } from '@/features/api/server'
import head from '@/lib/utils/head'

export default withApiMasto(async ({ req, user, client }) => {
  const timeline = await client.getFavourites({
    max_id: head(req.query.max_id),
  })

  const cursor = parseLinkHeader(timeline.headers.link)
  const next = cursor?.next?.max_id
  const prev = cursor?.prev?.min_id

  const [_, instance] = user.split('@')
  return {
    data: transformStatus(timeline.data as any, instance),
    links: { prev, next },
  }
})
