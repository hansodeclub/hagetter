import { withApi } from '@/utils/api/server'
import head from '@/utils/head'
import { PostFirestoreRepository } from '@/infrastructure/firestore/PostFirestoreRepository'
import { toJsonObject } from '@/utils/serializer'

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
