import { NextRequest } from "next/server"

import { getMastoSession } from "@/features/auth/session"
import { transformStatus } from "@/features/posts/verification"
import { errorResponse, successResponse } from "@/features/rest-api/response"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const keyword = searchParams.get("keyword")

		if (!keyword) {
			return errorResponse("keyword is not specified", 400)
		}

		// 認証とMastodonクライアントが必要
		const session = getMastoSession(request)
		if (!session) {
			return errorResponse("Unauthorized", 401)
		}

		const { client, instance } = session
		const timeline = await client.search(keyword, "statuses")

		return successResponse(transformStatus(timeline.data.statuses, instance))
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
