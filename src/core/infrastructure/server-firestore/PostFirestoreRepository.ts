import {
  HagetterPost,
  HagetterPostInfo,
  PostVisibility,
  VerifiableHagetterItem,
  parseContentItem,
  parseHagetterPostInfo,
} from '@/core/domains/post/HagetterPost'
import {
  IPostRepository,
  QueryPostsOptions,
} from '@/core/domains/post/PostRepository'
import { Account } from '@/core/domains/post/Status'

import { NotFound } from '@/lib/api/HttpResponse'
import { QueryResult } from '@/lib/api/QueryResult'
import { verifyItems } from '@/lib/api/server'
import { firestore } from '@/lib/firebase/admin'
import { fromJsonObject, toJsonObject } from '@/lib/serializer'

export interface HagetterPostInput {
  title: string
  description: string
  image: string | null
  visibility: PostVisibility
  contents: VerifiableHagetterItem[]
}

type PickByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

const makeResult = <T>(
  items: T[],
  cursorKey: keyof PickByValueType<T, string>
): QueryResult<T> => {
  if (items.length <= 1)
    return {
      count: items.length,
      items: items,
      cursor: null,
    }

  // last item only used for checking that result has next page
  const returnItems = items.slice(0, -1)
  const cursorItem = returnItems[returnItems.length - 1]

  const cursor = cursorItem[cursorKey] as never as string // fix later

  return {
    count: returnItems.length,
    items: returnItems,
    cursor,
  }
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

    if (options?.limit) query = query.limit(options.limit + 1)

    query = query.orderBy('created_at', 'desc')

    if (options?.cursor) query = query.startAfter(options.cursor)

    const result = await query.get()
    const items: HagetterPostInfo[] = result.docs.map((doc) => {
      return parseHagetterPostInfo({
        id: doc.id,
        ...doc.data(),
      })
    })

    return makeResult(items, 'createdAt')
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

    await Promise.all([postRef.delete(), contentsRef.delete()])
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
