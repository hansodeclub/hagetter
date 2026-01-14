import { HagetterPost, parseHagetterPost } from "@/entities/post"
import { firestore } from "@/lib/firebase/admin"

/**
 * ポストを取得する
 * @param hid
 */
export const getPost = async (hid: string): Promise<HagetterPost | null> => {
	const postRef = firestore.collection("posts").doc(hid)
	const contentsRef = postRef.collection("pages").doc("page0")
	const [postInfo, contents] = await Promise.all([
		postRef.get(),
		contentsRef.get(),
	])
	if (!postInfo.exists || !contents.exists) {
		return null
	}

	const postInfoData = postInfo.data()
	const contentsData = contents.data()
	if (!postInfoData || !contentsData) {
		return null
	}

	return parseHagetterPost({
		id: hid,
		...postInfoData,
		contents: contentsData.contents,
	})
}
