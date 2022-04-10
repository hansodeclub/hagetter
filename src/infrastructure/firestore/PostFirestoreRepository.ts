import {
  VerifiableHagetterItem,
  HagetterPost,
  HagetterPostInfo,
  parseContentItem,
  parseHagetterPostInfo,
  PostVisibility,
} from '@/entities/HagetterPost'
import { IPostRepository, QueryPostsOptions } from '@/interfaces/PostRepository'
import { firestore } from '@/utils/firebase/admin'
import { Account } from '@/entities/Status'
import { verifyItems } from '@/utils/api/server'
import { NotFound } from '@/entities/api/HttpResponse'
import { fromJsonObject, toJsonObject } from '@/utils/serializer'

export interface HagetterPostInput {
  title: string
  description: string
  image: string | null
  visibility: PostVisibility
  contents: VerifiableHagetterItem[]
}

export interface QueryResult<T> {
  count: number
  items: T[]
  cursor: string
}

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
    const [postInfo, contents] = await Promise.all([
      postRef.get(),
      contentsRef.get(),
    ])
    if (!postInfo.exists || !contents.exists) {
      return null
    }

    return {
      id: hid,
      contents: contents.data().contents.map(parseContentItem),
      ...parseHagetterPostInfo(postInfo.data()),
    }
  }

  /**
   * ポスト一覧情報を取得する
   * @param options
   */
  async queryPosts(
    options?: QueryPostsOptions
  ): Promise<QueryResult<HagetterPostInfo>> {
    let query: any = firestore.collection('posts')

    if (options?.visibility)
      query = query.where('visibility', '==', options.visibility)
    else if (options?.username)
      query = query.where('owner.acct', '==', options.username)

    if (options?.limit) query = query.limit(options.limit)

    query = query.orderBy('created_at', 'desc')

    const result = await query.get()
    const items: HagetterPostInfo[] = result.docs.map((doc) => {
      return parseHagetterPostInfo({
        id: doc.id,
        ...doc.data(),
      })
    })

    return {
      count: items.length,
      items: items,
      cursor: '',
    }
  }

  _randomDigit(non_zero: boolean = false) {
    if (non_zero) {
      return '123456789'[Math.floor(Math.random() * 9)]
    }

    return '0123456789'[Math.floor(Math.random() * 10)]
  }

  allocateId(length: number = 16) {
    let id: string = this._randomDigit(true)
    for (let i = 0; i < length - 1; i++) {
      id += this._randomDigit()
    }

    return id
  }

  /**
   * ポストを作成する
   * @param postData
   * @param owner
   */
  async createPost(postData: HagetterPostInput, owner: Account) {
    const newId = this.allocateId()
    const postRef = firestore.collection('posts').doc(newId)
    const contentsRef = postRef.collection('pages').doc('page0')

    if ((await postRef.get()).exists) {
      throw Error('Duplicate Key')
    }

    const postInfo: HagetterPostInfo = {
      id: newId,
      title: postData.title,
      description: postData.description,
      image: postData.image,
      visibility: postData.visibility,
      owner,

      stars: 0,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    }

    const contents = verifyItems(postData.contents)

    postRef.set(toJsonObject(postInfo))
    contentsRef.set(toJsonObject({ contents }))

    return { key: newId }
  }

  /**
   * ポストを更新する。ポストは所有者しか更新出来ない。
   * @param id
   * @param postData
   * @param owner
   */
  async updatePost(id: string, postData: HagetterPostInput, owner: Account) {
    const postRef = firestore.collection('posts').doc(id)
    const contentsRef = postRef.collection('pages').doc('page0')

    const res = await postRef.get()
    if (!res.exists) {
      throw new NotFound('Invalid post id')
    }

    const oldRecordInfo = fromJsonObject<HagetterPostInfo>(res.data())

    if (oldRecordInfo.owner.acct !== owner.acct) {
      throw new Error("You are trying to update other owner's post, fuck you")
    }

    const postInfo: Partial<HagetterPostInfo> = {
      id: id,
      title: postData.title,
      description: postData.description,
      image: postData.image,
      visibility: postData.visibility,
      owner,
      updatedAt: new Date().toISOString(),
    }

    const contents = verifyItems(postData.contents)

    await postRef.update(toJsonObject(postInfo))
    await contentsRef.update(toJsonObject({ contents }))

    return { key: id }
  }

  /**
   * ポストを削除する。ポストは所有者しか削除出来ない。
   * @param id
   * @param username
   */
  async deletePost(id: string, username: string) {
    const postRef = firestore.collection('posts').doc(id)
    const contentsRef = postRef.collection('pages').doc('page0')

    const res = await postRef.get()
    if (!res.exists) {
      throw new NotFound('Invalid post id')
    }

    const recordInfo = fromJsonObject<HagetterPostInfo>(res.data())

    if (recordInfo.owner.acct !== username) {
      throw new Error("You are trying to delete other owner's post, fuck you")
    }

    postRef.delete()
    contentsRef.delete()
  }

  /**
   * ポストにスターを追加する
   * @param id
   * @param username
   */
  /*async starPost(id: string, username: string) {
    throw new Error('not implemented yet')
  }*/
}
