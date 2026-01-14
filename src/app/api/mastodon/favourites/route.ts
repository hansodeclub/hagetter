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
		const timeline = await client.getFavourites({
			max_id: max_id || undefined,
		})

		// Note: Link header parsing would need to be implemented
		// const cursor = parseLinkHeader(timeline.headers.link)
		// const next = cursor?.next?.max_id
		// const prev = cursor?.prev?.min_id

		return successResponse(transformStatus(timeline.data, instance), {
			prev: undefined,
			next: undefined,
		})
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
