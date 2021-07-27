import { HagetterPost, HagetterPostInfo } from '~/entities/HagetterPost'
import { IPostRepository, QueryPostsOptions } from '~/interfaces/PostRepository'
import { HagetterApiClient } from '~/utils/hage'

/**
 * クライアントサイドからAPI経由でポストを取得する
 */
export class PostClientRepository implements IPostRepository {
  async getPost(hid: string) {
    const hagetterClient = new HagetterApiClient()
    return await hagetterClient.getPost(hid)
  }

  async queryPosts(options?: QueryPostsOptions) {
    const hagetterClient = new HagetterApiClient()
    return await hagetterClient.getPosts()
  }
}
