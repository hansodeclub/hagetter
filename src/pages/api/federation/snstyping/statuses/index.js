import { PostFirestoreRepository } from '@/core/infrastructure/server-firestore/PostFirestoreRepository'

import { withApi } from '@/lib/api/server'

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
