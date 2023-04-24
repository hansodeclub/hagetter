import { withApi } from '@/features/api/server'
import { getPost } from '@/features/posts/api'
import head from '@/lib/utils/head'
import { toJsonObject } from '@/lib/utils/serializer'

const getPostItem = withApi(async ({ req, res }) => {
  const id = head(req.query.hid)
  if (!id) {
    res.status(403).json({ message: 'ID not specified' })
  }

  try {
    const post = await getPost(id)
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

export default getPostItem
