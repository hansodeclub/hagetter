import { NextRequest } from "next/server"

import { getMastoSession } from "@/features/auth/session"
import { transformStatus } from "@/features/posts/verification"
import { errorResponse, successResponse } from "@/features/rest-api/response"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const max_id = searchParams.get("max_id")

		// 認証とMastodonクライアントが必要
		const session = getMastoSession(request)
		if (!session) {
			return errorResponse("Unauthorized", 401)
		}

		const { client, instance } = session
		const timeline = await client.getPublicTimeline({
			max_id: max_id || undefined,
		})

		return successResponse(transformStatus(timeline.data, instance))
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
