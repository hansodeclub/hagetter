import { queryPosts } from './queryPosts'

interface GetRecentPostsOptions {
  limit?: number
  cursor?: string
}

export const getRecentPublicPost = async ({
  limit = 300,
}: GetRecentPostsOptions) => {
  return await queryPosts({
    limit: limit,
    visibility: 'public',
  })
}
