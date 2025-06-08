import {
	HagetterPostInfo,
	PostVisibility,
	isPostVisibility,
	parseHagetterPostInfo,
} from "@/entities/post"
import { QueryResult, makeResult } from "@/features/api/types/QueryResult"
import { firestore } from "@/lib/firebase/admin"

export interface QueryPostsParams {
	limit?: number
	cursor?: string
	username?: string
	visibility?: string
	order?: "desc" | "asc"
}

/**
 * ポスト一覧情報を取得する
 * @param options
 */
export const queryPosts = async (
	options?: QueryPostsParams,
): Promise<QueryResult<HagetterPostInfo>> => {
	let query: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query =
		firestore.collection("posts")

	if (options?.visibility) {
		const visibilities = options.visibility.split(",").map((v) => v.trim())
		if (!visibilities.every(isPostVisibility)) {
			throw Error("Invalid visibility")
		}

		if (visibilities.length === 1) {
			query = query.where("visibility", "==", visibilities[0])
		} else {
			query = query.where("visibility", "in", visibilities)
		}
	}

	if (options?.username) {
		query = query.where("owner.acct", "==", options.username)
	}

	if (options?.limit) {
		query = query.limit(options.limit + 1)
	}

	query = query.orderBy("created_at", options?.order ?? "desc")

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
