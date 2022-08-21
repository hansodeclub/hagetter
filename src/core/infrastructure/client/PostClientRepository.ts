import {
  IPostRepository,
  QueryPostsOptions,
} from '@/core/domains/post/PostRepository'

import { HagetterClient } from '@/lib/hagetterClient'

/**
 * クライアントサイドからAPI経由でポストを取得する
 */
export class PostClientRepository implements IPostRepository {
  async getPost(hid: string) {
    const hagetterClient = new HagetterClient()
    return await hagetterClient.getPost(hid)
  }

  async queryPosts(options?: QueryPostsOptions) {
    const hagetterClient = new HagetterClient()
    return await hagetterClient.getPosts(options)
  }
}
