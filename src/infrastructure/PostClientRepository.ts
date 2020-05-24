import { HagetterPost, HagetterPostInfo } from '~/entities/HagetterPost'
import { IPostRepository, QueryPostsOptions } from '~/interfaces/PostRepository'

/**
 * クライアントサイドからAPI経由でポストを取得する
 */
export class PostClientRepository implements IPostRepository {
  async getPost(hid: string) {
    const response = await fetch(`/api/post?id=${encodeURIComponent(hid)}`)
    const result = await response.json()
    return result.data as HagetterPost
  }

  async queryPosts(options?: QueryPostsOptions) {
    const response = await fetch(`/api/posts`)
    const result = await response.json()
    console.log(result.data)
    return result.data
    //return result.data.items as HagetterPostInfo[]
    //const result = await datastore.runQuery()
  }
}
