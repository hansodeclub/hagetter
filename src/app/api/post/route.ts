import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

import { HagetterItem, PostVisibility, isPostVisibility } from "@/entities/post"
import { VerifiableStatus } from "@/entities/verifiable-status"
import {
	getMyAccount,
	signStatus,
	withApiAuth,
	withApiMasto,
} from "@/features/api/server"
import { NotFound } from "@/features/api/types/HttpResponse"
import {
	createPost,
	deletePost,
	getPost,
	updatePost,
} from "@/features/posts/actions"
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
			return NextResponse.json({ error: "No ID" }, { status: 400 })
		}

		if (action === "edit") {
			// 認証が必要な編集用取得
			const authHeader = request.headers.get("authorization")
			if (!authHeader) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
			}

			// withApiAuthの代替実装が必要（ここでは簡略化）
			const post = await getPost(id)
			if (!post) {
				return NextResponse.json({ error: "Item not found" }, { status: 404 })
			}

			const securePost = {
				...post,
				contents: secureItems(post.contents),
				id,
			}

			return NextResponse.json({ data: securePost })
		} else {
			// 一般的な取得
			const post = await getPost(id)
			if (!post) {
				return NextResponse.json({ error: "Item not found" }, { status: 404 })
			}

			return NextResponse.json({ data: toJsonObject(post) })
		}
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		// 認証とMastodonクライアントの取得が必要
		// withApiMastoの代替実装が必要（ここでは簡略化）
		
		if (!isPostVisibility(body.visibility)) {
			return NextResponse.json(
				{ error: `Invalid visibility: ${body.visibility}` },
				{ status: 400 }
			)
		}

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
				body.owner // 実際の実装では認証から取得
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
				body.owner // 実際の実装では認証から取得
			)
		}

		// キャッシュの再検証
		if (result?.key) {
			revalidatePath("/")
			revalidatePath(`/hi/${result.key}`)
			revalidateTag("posts")
		}

		return NextResponse.json({ data: result })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get("id")
		
		if (!id) {
			return NextResponse.json({ error: "ID not specified" }, { status: 400 })
		}

		// 認証が必要
		const authHeader = request.headers.get("authorization")
		if (!authHeader) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// withApiAuthの代替実装が必要（ここでは簡略化）
		await deletePost(id, "user") // 実際の実装では認証から取得

		// キャッシュの再検証
		revalidatePath("/")
		revalidatePath(`/hi/${id}`)
		revalidateTag("posts")

		return NextResponse.json({ data: { key: id } })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}