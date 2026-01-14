import { NextRequest } from "next/server"

import { getMastoSession } from "@/features/auth/session"
import { transformStatus } from "@/features/posts/verification"
import { errorResponse, successResponse } from "@/features/rest-api/response"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const urls = body.urls

		if (!urls || !Array.isArray(urls)) {
			return errorResponse("urls array is required", 400)
		}

		// 認証とMastodonクライアントが必要
		const session = getMastoSession(request)
		if (!session) {
			return errorResponse("Unauthorized", 401)
		}

		const { client, instance } = session
		const ids: string[] = []

		urls.forEach((url) => {
			const match = url.match(
				`https://${instance.replace(".", "\\.")}/.*/(\\d*)$`,
			)
			if (match) {
				ids.push(match[1])
			}
		})

		const result: any[] = []
		for (const id of ids) {
			const status = await client.getStatus(id)
			result.push(status.data)
		}

		return successResponse(transformStatus(result, instance))
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
