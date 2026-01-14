import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest } from "next/server"

import { HagetterItem, isPostVisibility } from "@/entities/post"
import { VerifiableStatus } from "@/entities/verifiable-status"
import { getMyAccount } from "@/features/auth/mastodon"
import { signStatus } from "@/features/posts/verification"

import { getMastoSession, getSession } from "@/features/auth/session"
import {
	createPost,
	deletePost,
	getPost,
	updatePost,
} from "@/features/posts/actions"
import { errorResponse, successResponse } from "@/features/rest-api/response"
import { fromJsonObject, toJsonObject } from "@/lib/serializer"
import head from "@/lib/utils/head"

const secureItems = (items: HagetterItem[]): HagetterItem[] => {
	return items.map((item) => {
		if (item.type === "status") {
			return {
				...item,
				data: signStatus(item.data as VerifiableStatus),
			}
		} else return item
	})
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get("id")
		const action = searchParams.get("action")

		if (!id) {
			return errorResponse("No ID", 400)
		}

		if (action === "edit") {
			// 認証が必要な編集用取得
			const session = getSession(request)
			if (!session) {
				return errorResponse("Unauthorized", 401)
			}

			const post = await getPost(id)
			if (!post) {
				return errorResponse("Item not found", 404)
			}

			const securePost = {
				...post,
				contents: secureItems(post.contents),
				id,
			}

			return successResponse(securePost)
		} else {
			// 一般的な取得
			const post = await getPost(id)
			if (!post) {
				return errorResponse("Item not found", 404)
			}

			return successResponse(toJsonObject(post))
		}
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// 認証とMastodonクライアントの取得が必要
		const session = getMastoSession(request)
		if (!session) {
			return errorResponse("Unauthorized", 401)
		}

		if (!isPostVisibility(body.visibility)) {
			return errorResponse(`Invalid visibility: ${body.visibility}`, 400)
		}

		// Get full account object
		const account = await getMyAccount(session.client, session.instance)
		let result
		if (!body.hid) {
			// 新規投稿作成
			result = await createPost(
				{
					title: body.title,
					description: body.description,
					image: null,
					visibility: body.visibility,
					contents: fromJsonObject(body.data),
				},
				account,
			)
		} else {
			// 投稿更新
			const id = head(body.hid)
			result = await updatePost(
				{
					id,
					title: body.title,
					description: body.description,
					image: null,
					visibility: body.visibility,
					contents: fromJsonObject(body.data),
				},
				account,
			)
		}

		// キャッシュの再検証
		if (result?.key) {
			revalidatePath("/")
			revalidatePath(`/hi/${result.key}`)
			revalidateTag("posts")
		}

		return successResponse(result)
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get("id")

		if (!id) {
			return errorResponse("ID not specified", 400)
		}

		// 認証が必要
		const session = getSession(request)
		if (!session) {
			return errorResponse("Unauthorized", 401)
		}

		const { user } = session
		await deletePost(id, user)

		// キャッシュの再検証
		revalidatePath("/")
		revalidatePath(`/hi/${id}`)
		revalidateTag("posts")

		return successResponse({ key: id })
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
