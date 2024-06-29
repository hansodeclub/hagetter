import { QueryResult, makeResult } from "@/features/api/types/QueryResult"
import {
	HagetterPostInfo,
	PostVisibility,
	parseHagetterPostInfo,
} from "@/features/posts/types/HagetterPost"
import { firestore } from "@/lib/firebase/admin"

export interface QueryPostsParams {
	limit?: number
	cursor?: string
	username?: string
	visibility?: PostVisibility
}
/**
 * ポスト一覧情報を取得する
 * @param options
 */
export const queryPosts = async (
	options?: QueryPostsParams,
): Promise<QueryResult<HagetterPostInfo>> => {
	let query: any = firestore.collection("posts")

	if (options?.visibility) {
		query = query.where("visibility", "==", options.visibility)
	}

	if (options?.username) {
		query = query.where("owner.acct", "==", options.username)
	}

	if (options?.limit) {
		query = query.limit(options.limit + 1)
	}

	query = query.orderBy("created_at", "desc")

	if (options?.cursor) query = query.startAfter(options.cursor)

	const result = await query.get()
	const items: HagetterPostInfo[] = result.docs.map((doc) => {
		return parseHagetterPostInfo({
			id: doc.id,
			...doc.data(),
		})
	})

	return makeResult(items, "createdAt")
}
