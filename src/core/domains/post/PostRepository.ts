import { QueryResult } from '@/lib/api/QueryResult'

import { HagetterPost, HagetterPostInfo, PostVisibility } from './HagetterPost'

export interface QueryPostsOptions {
  limit?: number
  cursor?: string
  username?: string
  visibility?: PostVisibility
}

export interface IPostRepository {
  getPost(hid: string): Promise<HagetterPost>
  queryPosts(
    options?: QueryPostsOptions
  ): Promise<QueryResult<HagetterPostInfo>>
}
