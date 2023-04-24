import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { respondError, withApi, withApiAuth } from '@/features/api/server'
import { queryPosts } from '@/features/posts/api'
import head from '@/lib/utils/head'

const getUserPosts = withApiAuth(async ({ req, res, user }) => {
  const username = head(req.query.user)
  if (user !== username) {
    throw Error('不正なユーザーID')
  }

  const items = await queryPosts({ username })
  return { data: items }
})

const getPosts = withApi(async ({ req, res }) => {
  const items = await queryPosts({
    visibility: 'public',
    limit: Number.parseInt(head(req.query.limit ?? ['100'])),
    cursor: head(req.query.cursor),
  })

  return { data: items }
})

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const username = head(req.query.user)
      if (username) {
        await getUserPosts(req, res)
      } else {
        await getPosts(req, res)
      }
    } else {
      respondError(res, `Unknown method: ${req.method}`)
    }
  } catch (err) {
    console.error(err)
    respondError(res, err)
  }
}

export default handler
