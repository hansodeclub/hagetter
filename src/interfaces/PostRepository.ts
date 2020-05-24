import { HagetterPost, HagetterPostInfo } from '~/entities/HagetterPost'
import { QueryResult } from '~/entities/api/QueryResult'

export interface QueryPostsOptions {
  limit?: number
  cursor?: string
  username?: string
  visibility?: string
}

export interface IPostRepository {
  getPost(hid: string): Promise<HagetterPost>
  queryPosts(
    options?: QueryPostsOptions
  ): Promise<QueryResult<HagetterPostInfo>>
}
