import { firestore } from "@/lib/firebase/admin"

import { errorFirestoreConverter } from "./utils"

export interface CreateErrorParams {
	page: string
	message?: string
	time: string
	stack: string[]
}

/**
 * サーバーサイド(FireStore)でインスタンス情報を直接取得する
 */
export const createError = async (error: CreateErrorParams) => {
	// ErrorReport型はidを持つがidは追加に自動生成されるためダミーを入れる
	const input = {
		id: "",
		...error,
	}

	const doc = await firestore
		.collection("errors")
		.withConverter(errorFirestoreConverter)
		.add(input)

	return { id: doc.id }
}
