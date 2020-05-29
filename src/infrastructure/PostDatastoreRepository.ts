import {
  HagetterPost,
  HagetterPostInfo,
  Convert,
} from '~/entities/HagetterPost'
import { IPostRepository, QueryPostsOptions } from '~/interfaces/PostRepository'
import { NotFound } from '~/entities/api/HttpResponse'
import { Datastore } from '@google-cloud/datastore'

/**
 * サーバーサイド(DataStore)でポストを直接取得する
 */
export class PostDatastoreRepository implements IPostRepository {
  // 初期化とか必要になればDatastoreHandlerを作る
  readonly datastore: Datastore = new Datastore()

  async getPost(hid: string): Promise<HagetterPost> {
    const result = await this.datastore.get(
      this.datastore.key(['Hagetter', Number.parseInt(hid)])
    )

    if (result[0]) {
      const serialized = JSON.parse(JSON.stringify(result[0]))
      return { ...serialized, id: hid } as HagetterPost
    } else {
      throw new NotFound('Item not found')
    }
  }

  /**
   * ポスト一覧情報を取得する
   * @param options
   */
  async queryPosts(options?: QueryPostsOptions) {
    let query = this.datastore.createQuery('Hagetter')

    if (options?.visibility)
      query = query.filter('visibility', '=', options.visibility)
    else if (options?.username)
      query = query.filter('username', '=', options.username)

    if (options?.limit) query = query.limit(options.limit)

    query = query.order('created_at', {
      descending: true,
    })

    //
    const [items, info] = await this.datastore.runQuery(query)
    const results: HagetterPostInfo[] = items.map(
      (item) =>
        ({
          id: item[this.datastore.KEY].id,
          avatar: item.avatar,
          created_at: item.created_at,
          description: item.description,
          displayName: item.displayName,
          image: item.image,
          stars: item.stars,
          title: item.title,
          updated_at: item.updated_at,
        } as HagetterPostInfo)
    )

    return {
      count: results.length,
      items: results,
      cursor: info.endCursor,
    }
  }

  async createPost() {}

  async updatePost() {}

  async delelePost() {}
}
