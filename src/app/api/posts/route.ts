import { NextRequest, NextResponse } from "next/server"

import { getSession } from "@/features/auth/session"
import { queryPosts } from "@/features/posts/actions"
import { errorResponse, successResponse } from "@/features/rest-api/response"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const username = searchParams.get("user")
		const visibility = searchParams.get("visibility") ?? "public"
		const limitParam = searchParams.get("limit")
		const cursor = searchParams.get("cursor")

		// 認証が必要な場合の処理
		if (username && visibility !== "public") {
			const session = getSession(request)
			if (!session) {
				return errorResponse("Unauthorized", 401)
			}
			const items = await queryPosts({ username, visibility })
			return successResponse(items)
		} else if (username) {
			// 特定ユーザーの公開投稿
			const items = await queryPosts({ username, visibility: "public" })
			return successResponse(items)
		} else {
			// 全体の公開投稿
			const limit = limitParam ? Number.parseInt(limitParam) : 100
			const items = await queryPosts({
				visibility: "public",
				limit,
				cursor: cursor || undefined,
			})
			return successResponse(items)
		}
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
