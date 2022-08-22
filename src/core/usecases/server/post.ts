import { PostFirestoreRepository } from '@/core/infrastructure/server-firestore/PostFirestoreRepository'

interface GetRecentPostsOptions {
  count?: number
  cursor?: string
}

export const getRecentPost = async ({ count }: GetRecentPostsOptions) => {
  const postRepository = new PostFirestoreRepository()
  return await postRepository.queryPosts({
    limit: count ?? 300,
    visibility: 'public',
  })
}
