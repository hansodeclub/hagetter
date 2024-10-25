import { HagetterPostInfo } from "@/entities/post"
import { NotFound } from "@/features/api/types/HttpResponse"
import { firestore } from "@/lib/firebase/admin"
import { fromJsonObject } from "@/lib/serializer"

/**
 * ポストを削除する。ポストは所有者しか削除出来ない。
 * @param id
 * @param username
 */
export const deletePost = async (
	id: string,
	username: string,
): Promise<{ id: string }> => {
	const postRef = firestore.collection("posts").doc(id)
	const contentsRef = postRef.collection("pages").doc("page0")

	const res = await postRef.get()
	if (!res.exists) {
		throw new NotFound("Invalid post id")
	}

	const recordInfo = fromJsonObject<HagetterPostInfo>(res.data()!)

	if (recordInfo.owner.acct !== username) {
		throw new Error("You are trying to delete other owner's post, fuck you")
	}

	await Promise.all([postRef.delete(), contentsRef.delete()])

	return { id }
}
