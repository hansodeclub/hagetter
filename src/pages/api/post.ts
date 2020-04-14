import { NextApiRequest, NextApiResponse } from 'next'
import {
  respondSuccess,
  respondError,
  withApi,
  withApiAuth,
  withApiMasto,
} from '../../utils/api/server'
import { Datastore } from '@google-cloud/datastore'
import head from '../../utils/head'
import { NotFound } from '../../utils/api/response'

const getPost = withApi(async ({ req, res }) => {
  const id = head(req.query.id)
  if (!id) {
    throw Error('No ID')
  }

  const datastore = new Datastore()
  const result = await datastore.get(
    datastore.key(['Hagetter', Number.parseInt(id)])
  )

  if (result[0]) {
    return { ...result[0], id }
  } else {
    throw new NotFound('Item not found')
  }
})

const createPost = withApiMasto(
  async ({ req, res, user, accessToken, masto }) => {
    const profile = await masto.verifyCredentials()

    const data = {
      title: req.body.title,
      description: req.body.description,
      image: null,
      username: user,
      displayName: profile.display_name || profile.username,
      avatar: profile.avatar,
      stars: 0,
      created_at: new Date(),
      data: req.body.data,
      user: profile,
      visibility: req.body.visibility,
    }

    // Create post and get ID
    const datastore = new Datastore()
    const result = await datastore.insert({
      key: datastore.key(['Hagetter']),
      data: data,
    })

    return { key: result[0].mutationResults[0].key.path[0].id }
  }
)

const deletePost = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)
  const datastore = new Datastore()
  const result = await datastore.get(
    datastore.key(['Hagetter', Number.parseInt(id)])
  )

  if (!result[0]) {
    throw Error(`PostID=${id} not found`)
  }

  if (result[0].username !== user) {
    throw Error('Invalid user')
  }

  await datastore.delete(datastore.key(['Hagetter', Number.parseInt(id)]))
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getPost(req, res)
    } else if (req.method === 'POST') {
      await createPost(req, res)
    } else if (req.method === 'DELETE') {
      await deletePost(req, res)
    } else {
      respondError(res, `Unknown method: ${req.method}`)
    }
  } catch (err) {
    console.error(err)
    respondError(res, err)
  }
}
