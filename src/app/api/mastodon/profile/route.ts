import { NextRequest } from "next/server"

import { getMastoSession } from "@/features/auth/session"
import { errorResponse, successResponse } from "@/features/rest-api/response"

export async function GET(request: NextRequest) {
	try {
		// 認証とMastodonクライアントが必要
		const session = getMastoSession(request)
		if (!session) {
			return errorResponse("Unauthorized", 401)
		}

		const { client, instance } = session
		const response = await client.verifyAccountCredentials()
		const profile = response.data

		if (!profile.acct.includes("@")) {
			profile.acct = `${profile.acct}@${instance}`
		}

		return successResponse(profile)
	} catch (err) {
		console.error(err)
		return errorResponse(err.message, 500)
	}
}
