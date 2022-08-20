import { PostFirestoreRepository } from '@/core/infrastructure/firestore/PostFirestoreRepository'

interface GetRecentPostsOptions {
  count?: number
  cursor?: string
}

export const getRecentPosts = async ({ count }: GetRecentPostsOptions) => {
  const postRepository = new PostFirestoreRepository()
  return await postRepository.queryPosts({
    limit: count ?? 300,
    visibility: 'public',
  })
}
