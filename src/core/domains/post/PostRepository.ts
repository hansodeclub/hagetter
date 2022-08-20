import {
  HagetterPost,
  HagetterPostInfo,
  PostVisibility,
} from '@/core/domains/post/HagetterPost'

import { QueryResult } from '@/lib/api/QueryResult'

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
