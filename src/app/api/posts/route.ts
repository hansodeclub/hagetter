import { NextRequest, NextResponse } from "next/server"

import { queryPosts } from "@/features/posts/actions"
import head from "@/lib/utils/head"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const username = searchParams.get("user")
		const visibility = searchParams.get("visibility") ?? "public"
		const limitParam = searchParams.get("limit")
		const cursor = searchParams.get("cursor")

		// 認証が必要な場合の処理（簡略化）
		if (username && visibility !== "public") {
			const authHeader = request.headers.get("authorization")
			if (!authHeader) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
			}
			// withApiAuthの代替実装が必要
			const items = await queryPosts({ username, visibility })
			return NextResponse.json({ data: items })
		} else if (username) {
			// 特定ユーザーの公開投稿
			const items = await queryPosts({ username, visibility: "public" })
			return NextResponse.json({ data: items })
		} else {
			// 全体の公開投稿
			const limit = limitParam ? Number.parseInt(limitParam) : 100
			const items = await queryPosts({
				visibility: "public",
				limit,
				cursor: cursor || undefined,
			})
			return NextResponse.json({ data: items })
		}
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}