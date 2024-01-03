import {
  HagetterPost,
  parseContentItem,
  parseHagetterPostInfo,
} from '@/features/posts/types/HagetterPost'
import { firestore } from '@/lib/firebase/admin'

/**
 * ポストを取得する
 * @param hid
 */
export const getPost = async (hid: string): Promise<HagetterPost | null> => {
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
    ...(parseHagetterPostInfo(postInfo.data()!) as Exclude<
      HagetterPost,
      'id' | 'contents'
    >),
    id: hid,
    contents: contents.data()!.contents.map(parseContentItem),
  }
}
