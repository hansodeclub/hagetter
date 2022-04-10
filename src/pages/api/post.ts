import { NextApiRequest, NextApiResponse } from 'next'
import {
  respondError,
  withApi,
  withApiAuth,
  withApiMasto,
  secureStatus,
  getMyAccount,
} from '@/utils/api/server'
import head from '@/utils/head'
import { NotFound } from '@/entities/api/HttpResponse'
import { VerifiableStatus } from '@/entities/SecuredStatus'
import { HagetterItem, PostVisibility } from '@/entities/HagetterPost'
import { PostFirestoreRepository } from '@/infrastructure/firestore/PostFirestoreRepository'
import { fromJsonObject, toJsonObject } from '@/utils/serializer'

const getPost = withApi(async ({ req, res }) => {
  const id = head(req.query.id)
  if (!id) {
    throw Error('No ID')
  }

  const postRepository = new PostFirestoreRepository()
  const post = await postRepository.getPost(id)
  if (!post) {
    throw new NotFound('Item not found!')
  }

  return toJsonObject(post)
})

const getMyPost = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)
  if (!id) {
    throw Error('No ID')
  }

  const postRepository = new PostFirestoreRepository()
  const post = await postRepository.getPost(id)

  if (post) {
    if (post.owner.acct !== user) {
      throw Error("It's not your post, fuck you")
    }

    const securePost = {
      ...post,
      contents: secureItems(post.contents),
      id,
    }

    return securePost
  } else {
    throw new NotFound('Item not found')
  }
})

const secureItems = (items: HagetterItem[]): HagetterItem[] => {
  return items.map((item) => {
    if (item.type === 'status') {
      return {
        ...item,
        data: secureStatus(item.data as VerifiableStatus),
      }
    } else return item
  })
}

const createPost = withApiMasto(
  async ({ req, res, user, accessToken, client }) => {
    const [_, instance] = user.split('@')
    const owner = await getMyAccount(client, instance)

    if (!req.body.hid) {
      // Create post
      const postRepository = new PostFirestoreRepository()
      return await postRepository.createPost(
        {
          title: req.body.title,
          description: req.body.description,
          image: null,
          visibility: req.body.visibility as PostVisibility,
          contents: fromJsonObject(req.body.data),
        },
        owner
      )
    } else {
      // Update Post
      const id = head(req.body.hid)
      const postRepository = new PostFirestoreRepository()
      return await postRepository.updatePost(
        id,
        {
          title: req.body.title,
          description: req.body.description,
          image: null,
          visibility: req.body.visibility as PostVisibility,
          contents: fromJsonObject(req.body.data),
        },
        owner
      )
    }
  }
)

const deletePost = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)

  const postRepository = new PostFirestoreRepository()
  await postRepository.deletePost(id, user)

  return {}
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
