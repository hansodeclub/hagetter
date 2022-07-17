import { IPostRepository } from '@/interfaces/PostRepository'

export class GetPost {
  constructor(readonly postRepository: IPostRepository) {}

  async execute(hid: string) {
    return this.postRepository.getPost(hid)
  }
}
