import { verifyItems } from '@/features/api/server'
import {
  HagetterPostInfo,
  PostVisibility,
  VerifiableHagetterItem,
} from '@/features/posts/types/HagetterPost'
import { Account } from '@/features/posts/types/Status'
import { firestore } from '@/lib/firebase/admin'
import { toJsonObject } from '@/lib/utils/serializer'

export interface CreatePostParams {
  title: string
  description: string
  image: string | null
  visibility: PostVisibility
  contents: VerifiableHagetterItem[]
}

/**
 * ポストを作成する
 * @param postData
 * @param owner
 */
export const createPost = async (
  postData: CreatePostParams,
  owner: Account
) => {
  const newId = allocateId()
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
  }

  const contents = verifyItems(postData.contents)

  await postRef.set(toJsonObject(postInfo))
  await contentsRef.set(toJsonObject({ contents }))

  return { key: newId }
}

const randomDigit = (non_zero: boolean = false) => {
  if (non_zero) {
    return '123456789'[Math.floor(Math.random() * 9)]
  }

  return '0123456789'[Math.floor(Math.random() * 10)]
}

const allocateId = (length: number = 16) => {
  let id: string = randomDigit(true)
  for (let i = 0; i < length - 1; i++) {
    id += randomDigit()
  }

  return id
}
