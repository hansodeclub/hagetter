import { PostFirestoreRepository } from '@/core/infrastructure/firestore/PostFirestoreRepository'

import { withApi } from '@/lib/api/server'
import head from '@/lib/head'
import { toJsonObject } from '@/lib/serializer'

const getPost = withApi(async ({ req, res }) => {
  const id = head(req.query.hid)
  if (!id) {
    res.status(403).json({ message: 'ID not specified' })
  }

  const postRepository = new PostFirestoreRepository()
  try {
    const post = await postRepository.getPost(id)
    res.json(
      toJsonObject(
        post.contents.reduce(
          (acc, item) => (item.type === 'status' ? [...acc, item.data] : acc),
          []
        )
      )
    )
  } catch (err) {
    res.status(404).json({ message: 'Item not found' })
  }
})

export default getPost
