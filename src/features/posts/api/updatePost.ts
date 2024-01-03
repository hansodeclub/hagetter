import { verifyItems } from '@/features/api/server'
import { NotFound } from '@/features/api/types/HttpResponse'
import { CreatePostParams } from '@/features/posts/api/createPost'
import { HagetterPostInfo } from '@/features/posts/types/HagetterPost'
import { Account } from '@/features/posts/types/Status'
import { firestore } from '@/lib/firebase/admin'
import { fromJsonObject, toJsonObject } from '@/lib/utils/serializer'

export type UpdatePostParams = CreatePostParams & { id: string }
/**
 * ポストを更新する。ポストは所有者しか更新出来ない。
 * @param id
 * @param postData
 * @param owner
 */
export const updatePost = async (
  postData: UpdatePostParams,
  owner: Account
) => {
  const postRef = firestore.collection('posts').doc(postData.id)
  const contentsRef = postRef.collection('pages').doc('page0')

  const res = await postRef.get()
  if (!res.exists) {
    throw new NotFound('Invalid post id')
  }

  const oldRecordInfo = fromJsonObject<HagetterPostInfo>(res.data()!)

  if (oldRecordInfo.owner.acct !== owner.acct) {
    throw new Error("You are trying to update other owner's post, fuck you")
  }

  const postInfo: Partial<HagetterPostInfo> = {
    id: postData.id,
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

  return { key: postData.id }
}
