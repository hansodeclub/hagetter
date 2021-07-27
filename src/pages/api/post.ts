import { NextApiRequest, NextApiResponse } from 'next'
import {
  respondError,
  withApi,
  withApiAuth,
  withApiMasto,
  secureStatus,
} from '../../utils/api/server'
import { Datastore } from '@google-cloud/datastore'
import head from '../../utils/head'
import { NotFound } from '~/entities/api/HttpResponse'
import { verifyStatus } from '~/utils/api/server'
import { IHagetterItemOut } from '~/stores/hagetterItem'
import { SecureStatus } from '~/entities/SecuredStatus'
import { HagetterPost } from '~/entities/HagetterPost'

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

const getMyPost = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)
  if (!id) {
    throw Error('No ID')
  }

  const datastore = new Datastore()
  const [post]: [HagetterPost] = await datastore.get(
    datastore.key(['Hagetter', Number.parseInt(id)])
  )

  if (post) {
    if (post.username !== user) {
      throw Error("It's not your post, fuck you")
    }

    const securePost = {
      ...post,
      data: secureItems(post.data),
      id,
    }

    return securePost
  } else {
    throw new NotFound('Item not found')
  }
})

const getRecordAndVerifyOwner = async (id: string, username: string) => {
  const datastore = new Datastore()
  const result = await datastore.get(
    datastore.key(['Hagetter', Number.parseInt(id)])
  )

  if (result[0] && result[0].username === username) {
    return result[0]
  }

  return false
}

const secureItems = (items: IHagetterItemOut[]): IHagetterItemOut[] => {
  return items.map((item) => {
    if (item.type === 'status') {
      return {
        ...item,
        data: secureStatus(item.data as SecureStatus),
      }
    } else return item
  })
}

const verifyItems = (items: IHagetterItemOut[]): IHagetterItemOut[] => {
  try {
    return items.map((item) => {
      if (item.type === 'status') {
        return {
          ...item,
          data: verifyStatus(item.data as SecureStatus),
        }
      } else return item
    })
  } catch (err) {
    console.error(err)
    throw Error('不正なステータス')
  }
}

const createPost = withApiMasto(
  async ({ req, res, user, accessToken, masto }) => {
    const profile = await masto.verifyCredentials()

    if (req.body.hid) {
      // update post
      const oldRecord = await getRecordAndVerifyOwner(req.body.hid, user)
      if (!oldRecord) {
        throw Error("You are trying to update other owner's post, fuck you")
      }

      const items = verifyItems(req.body.data)

      const data = {
        ...oldRecord,
        updated_at: new Date(),
        title: req.body.title,
        description: req.body.description,
        data: items,
        visibility: req.body.visibility,
      }

      const datastore = new Datastore()
      const key = datastore.key(['Hagetter', Number.parseInt(req.body.hid)])
      const _result = await datastore.update({
        key,
        data: data,
      })

      return { key: Number.parseInt(req.body.hid) }
    } else {
      // Validationする
      const items = (req.body.data as any[]).map((item) => {
        if (item.type === 'status') {
          return {
            ...item,
            data: verifyStatus(item.data),
          }
        } else return item
      })

      const data = {
        title: req.body.title,
        description: req.body.description,
        image: null,
        username: user,
        displayName: profile.display_name || profile.username,
        avatar: profile.avatar,
        data: items,
        user: profile,
        visibility: req.body.visibility,
        created_at: new Date(),
        stars: 0,
      }
      data.user.note = '' // TODO: improve later

      // Create post and get ID
      const datastore = new Datastore()
      const key = datastore.key(['Hagetter'])
      const result = await datastore.insert({
        key,
        data: data,
      })

      return { key: result[0].mutationResults[0].key.path[0].id }
    }
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
      const action = head(req.query.action)
      if (action === 'edit') {
        await getMyPost(req, res)
      } else await getPost(req, res)
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
