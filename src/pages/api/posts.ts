import { NextApiRequest, NextApiResponse } from 'next'
import { withApi, respondError, withApiAuth } from '@/utils/api/server'
import head from '@/utils/head'
import { ListPosts, ListPostsOptions } from '@/usecases/ListPosts'
import { PostFirestoreRepository } from '@/infrastructure/firestore/PostFirestoreRepository'

const getUserPosts = withApiAuth(async ({ req, res, user }) => {
  const username = head(req.query.user)
  if (user !== username) {
    throw Error('不正なユーザーID')
  }

  const action = new ListPosts(new PostFirestoreRepository())
  const items = await action.execute({ username })
  return items
})

const getPosts = withApi(async ({ req, res }) => {
  const options: ListPostsOptions = {
    visibility: 'public',
    limit: Number.parseInt(head(req.query.limit ?? ['100'])),
  }
  const action = new ListPosts(new PostFirestoreRepository())
  const items = await action.execute(options)
  return items
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
