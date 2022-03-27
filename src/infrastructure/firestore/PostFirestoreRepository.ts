import {
  HagetterPost,
  HagetterPostInfo, hagetterPostInfoFromObject, parseContentItem
} from '~/entities/HagetterPost'
import { IPostRepository, QueryPostsOptions } from '~/interfaces/PostRepository'
import { NotFound } from '~/entities/api/HttpResponse'
import { Datastore } from '@google-cloud/datastore'
import { firestore } from '~/utils/firebase/admin'

/**
 * サーバーサイド(FileStore)でポストを直接取得する
 */
export class PostFirestoreRepository implements IPostRepository {
  /**
   * ポストを取得する
   * @param hid
   */
  async getPost(hid: string): Promise<HagetterPost | null> {
    const postRef = firestore.collection('posts').doc(hid)
    const contentsRef = postRef.collection('pages').doc('page0')
    // const starRef = firestore.collection('stars').doc(hid)
    const [postInfo, contents] = await Promise.all([postRef.get(), contentsRef.get()])
    if (!postInfo.exists || !contents.exists) {
      return null
    }

    return {
      id: hid,
      contents: contents.data().contents.map(parseContentItem),
      ...hagetterPostInfoFromObject(postInfo.data()),
    }

    /*const result = await this.datastore.get(
      this.datastore.key(['Hagetter', Number.parseInt(hid)])
    )

    if (result[0]) {
      const serialized = JSON.parse(JSON.stringify(result[0]))
      return { ...serialized, id: hid } as HagetterPost
    } else {
      throw new NotFound('Item not found')
    } */
  }

  /**
   * ポスト一覧情報を取得する
   * @param options
   */
  async queryPosts(options?: QueryPostsOptions) {
    let query: any = firestore.collection('posts')

    if (options?.visibility)
      query = query.where('visibility', '==', options.visibility)
    else if (options?.username)
      query = query.where('owner.acct', '==', options.username)

    if (options?.limit) query = query.limit(options.limit)
    console.log(options.limit)

    query = query.orderBy('created_at', 'desc')

    const result = await query.get()
    const items = result.docs.map(
      (doc) => {
        return hagetterPostInfoFromObject({
          id: doc.id,
          ...doc.data()
        })
      }
    )

    return {
      count: items.length,
      items: items,
      cursor: '',
    }
  }

  async createPost() {}

  async updatePost() {}

  async delelePost() {}
}
