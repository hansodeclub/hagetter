import { withApi } from '@/utils/api/server'
import { PostFirestoreRepository } from '@/infrastructure/firestore/PostFirestoreRepository'

const getPosts = withApi(async ({ res }) => {
  const postRepository = new PostFirestoreRepository()
  const posts = await postRepository.queryPosts({ limit: 50 })
  const tasks = posts.items.map((post) => ({
    id: post.id,
    title: post.title,
    username: post.owner.acct,
  }))

  res.status(200).json({
    count: posts.count,
    items: tasks,
  })
})

export default getPosts
