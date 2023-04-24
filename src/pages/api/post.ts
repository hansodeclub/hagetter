import { NextApiHandler, NextApiRequest } from 'next'

import {
  getMyAccount,
  respondError,
  respondSuccess,
  secureStatus,
  withApi,
  withApiAuth,
  withApiMasto,
} from '@/features/api/server'
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from '@/features/posts/api'
import {
  HagetterItem,
  PostVisibility,
} from '@/features/posts/types/HagetterPost'
import { VerifiableStatus } from '@/features/posts/types/VerifiableStatus'
import { purgeCache } from '@/lib/cdn/cloudflare'
import head from '@/lib/utils/head'
import { fromJsonObject, toJsonObject } from '@/lib/utils/serializer'
import getHost from '@/lib/utils/url'
import { NotFound } from '@/types/api/HttpResponse'

const getPostHandler = withApi(async ({ req }) => {
  const id = head(req.query.id)
  if (!id) {
    throw Error('No ID')
  }

  const post = await getPost(id)
  if (!post) {
    throw new NotFound('Item not found!')
  }

  return { data: toJsonObject(post) }
})

const getMyPostHandler = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)
  if (!id) {
    throw Error('No ID')
  }

  const post = await getPost(id)

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

const createPostHandler = withApiMasto(async ({ req, user, client }) => {
  const [_, instance] = user.split('@')
  const owner = await getMyAccount(client, instance)

  if (!req.body.hid) {
    // Create post
    return {
      data: await createPost(
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
    return {
      data: await updatePost(
        {
          id,
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
})

const deletePostHandler = withApiAuth(async ({ req, user }) => {
  const id = head(req.query.id)

  await deletePost(id, user)

  return { data: { key: id } }
})

const purgePostCache = async (
  req: NextApiRequest,
  hid: string,
  purgeHome: boolean = true
) => {
  const baseUrl = `${getHost(req)}`
  const urls = [
    ...(purgeHome ? [baseUrl] : []),
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
        await getMyPostHandler(req, res)
      } else await getPostHandler(req, res)
    } else if (req.method === 'POST') {
      const data = (await createPostHandler(req, res)) as any
      if (data.data?.key) await purgePostCache(req, data.data.key)
    } else if (req.method === 'DELETE') {
      const data = (await deletePostHandler(req, res)) as any
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
