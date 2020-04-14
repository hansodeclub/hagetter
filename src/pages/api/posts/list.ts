import { NextApiRequest, NextApiResponse } from 'next'
import { withApi, respondError, withApiAuth } from '../../../utils/api/server'
import { Datastore } from '@google-cloud/datastore'

import head from '../../../utils/head'

const getUserPosts = withApiAuth(async ({ req, res, user }) => {
  const username = head(req.query.user)
  const datastore = new Datastore()

  if (user !== username) {
    throw Error('不正なユーザーID')
  }

  const query = datastore
    .createQuery('Hagetter')
    .filter('username', '=', username)
    .order('created_at', {
      descending: true
    })

  const [tasks] = await datastore.runQuery(query)
  const results = tasks.map((task) => ({
    id: task[datastore.KEY].id,
    ...task
  }))

  return {
    count: results.length,
    items: results
  }
})

const getPosts = withApi(async ({ req, res }) => {
  const datastore = new Datastore()

  const query = datastore
    .createQuery('Hagetter')
    .filter('visibility', '=', 'public')
    .order('created_at', {
      descending: true
    })

  const [tasks] = await datastore.runQuery(query)
  const results = tasks.map((task) => ({
    id: task[datastore.KEY].id,
    ...task
  }))

  return {
    count: results.length,
    items: results
  }
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
