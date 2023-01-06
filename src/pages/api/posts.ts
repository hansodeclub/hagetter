import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { PostFirestoreRepository } from '@/core/infrastructure/server-firestore/PostFirestoreRepository'
import { ListPosts, ListPostsOptions } from '@/core/usecases/ListPosts'

import { respondError, withApi, withApiAuth } from '@/lib/api/server'
import head from '@/lib/head'

const getUserPosts = withApiAuth(async ({ req, res, user }) => {
  const username = head(req.query.user)
  if (user !== username) {
    throw Error('不正なユーザーID')
  }

  const action = new ListPosts(new PostFirestoreRepository())
  const items = await action.execute({ username })
  return { data: items }
})

const getPosts = withApi(async ({ req, res }) => {
  const options: ListPostsOptions = {
    visibility: 'public',
    limit: Number.parseInt(head(req.query.limit ?? ['100'])),
    cursor: head(req.query.cursor),
  }

  const action = new ListPosts(new PostFirestoreRepository())
  const items = await action.execute(options)
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
