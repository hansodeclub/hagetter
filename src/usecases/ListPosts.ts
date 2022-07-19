import { PostVisibility } from '@/entities/HagetterPost'
import { IPostRepository } from '@/interfaces/PostRepository'

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
