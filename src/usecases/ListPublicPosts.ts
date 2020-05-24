import { IPostRepository } from '~/interfaces/PostRepository'

export class ListPublicPosts {
  constructor(readonly postRepository: IPostRepository) {}

  async execute() {
    return this.postRepository.queryPosts({
      limit: 100,
      visibility: 'public',
    })
  }
}
