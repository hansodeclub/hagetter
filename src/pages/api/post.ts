import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { HagetterItem, PostVisibility } from '@/core/domains/post/HagetterPost'
import { VerifiableStatus } from '@/core/domains/post/VerifiableStatus'
import { PostFirestoreRepository } from '@/core/infrastructure/server-firestore/PostFirestoreRepository'

import { NotFound } from '@/lib/api/HttpResponse'
import {
  getMyAccount,
  respondError,
  respondSuccess,
  secureStatus,
  withApi,
  withApiAuth,
  withApiMasto,
} from '@/lib/api/server'
import { purgeCache } from '@/lib/cdn/cloudflare'
import getHost from '@/lib/getHost'
import head from '@/lib/head'
import { fromJsonObject, toJsonObject } from '@/lib/serializer'

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

  return { data: toJsonObject(post) }
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

    return { data: securePost }
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
      return {
        data: await postRepository.createPost(
          {
            title: req.body.title,
            description: req.body.description,
            image: null,
            visibility: req.body.visibility as PostVisibility,
            contents: fromJsonObject(req.body.data),
          },
          owner
        ),
      }
    } else {
      // Update Post
      const id = head(req.body.hid)
      const postRepository = new PostFirestoreRepository()
      return {
        data: await postRepository.updatePost(
          id,
          {
            title: req.body.title,
            description: req.body.description,
            image: null,
            visibility: req.body.visibility as PostVisibility,
            contents: fromJsonObject(req.body.data),
          },
          owner
        ),
      }
    }
  }
)

const deletePost = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)

  const postRepository = new PostFirestoreRepository()
  await postRepository.deletePost(id, user)

  return { data: { key: id } }
})

const purgePostCache = async (
  req: NextApiRequest,
  hid: string,
  purgeHome: boolean = true
) => {
  const baseUrl = `${getHost(req)}`
  const urls = [
    baseUrl,
    `${baseUrl}/_next/data/${process.env.NEXT_BUILD_ID}/index.json`,
    `${baseUrl}/hi/${hid}`,
    `${baseUrl}/_next/data/${process.env.NEXT_BUILD_ID}/hi/${hid}.json`,
  ]

  await purgeCache(urls)
}

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const action = head(req.query.action)
      if (action === 'edit') {
        await getMyPost(req, res)
      } else await getPost(req, res)
    } else if (req.method === 'POST') {
      const data = (await createPost(req, res)) as any
      if (data.data?.key) await purgePostCache(req, data.data.key)
    } else if (req.method === 'DELETE') {
      const data = (await deletePost(req, res)) as any
      if (data.data?.key) await purgePostCache(req, data.data.key)
    } else if (req.method === 'PURGE') {
      respondSuccess(res)
    } else {
      respondError(res, `Unknown method: ${req.method}`)
    }
  } catch (err) {
    console.error(err)
    respondError(res, err)
  }
}

export default handler
