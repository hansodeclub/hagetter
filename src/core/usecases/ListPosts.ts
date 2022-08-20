import { PostVisibility } from '@/core/domains/post/HagetterPost'
import { IPostRepository } from '@/core/domains/post/PostRepository'

export interface ListPostsOptions {
  limit?: number
  cursor?: string
  username?: string
  visibility?: PostVisibility
}

export class ListPosts {
  constructor(readonly postRepository: IPostRepository) {}

  async execute(options?: ListPostsOptions) {
    return this.postRepository.queryPosts({
      limit: options.limit ?? 100,
      visibility: options.visibility,
      username: options.username,
      cursor: options.cursor,
    })
  }
}
