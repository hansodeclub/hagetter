import generator, { MegalodonInterface } from "megalodon"
import { NextRequest } from "next/server"
import { verifyAuthorization, verifyToken } from "./signin"

/**
 * API認証用のセッション情報
 */
export interface Session {
	user: string
	accessToken: string
}

/**
 * Mastodon認証用のセッション情報
 */
export interface MastoSession extends Session {
	client: MegalodonInterface
	instance: string
}

/**
 * リクエストから認証情報を取得してセッションを作成する
 * @param request NextRequest
 * @returns Session | null
 */
export const getSession = (request: NextRequest): Session | null => {
	try {
		const authHeader = request.headers.get("authorization")
		if (!authHeader) {
			const cookie = request.cookies.get("token")
			if (!cookie) {
				return null
			}
			const { user, accessToken } = verifyToken(cookie.value)
			return { user, accessToken }
		}

		const { user, accessToken } = verifyAuthorization(authHeader)
		return { user, accessToken }
	} catch (err) {
		console.error("Failed to get session:", err)
		return null
	}
}

/**
 * リクエストから認証情報を取得してMastodonクライアントセッションを作成する
 * @param request NextRequest
 * @returns MastoSession | null
 */
export const getMastoSession = (request: NextRequest): MastoSession | null => {
	try {
		const session = getSession(request)
		if (!session) {
			return null
		}

		const { user, accessToken } = session
		const [_, instance] = user.split("@")

		if (!instance) {
			console.error("Invalid user format, expected username@instance")
			return null
		}

		const client = generator("mastodon", `https://${instance}`, accessToken)

		return {
			user,
			accessToken,
			client,
			instance,
		}
	} catch (err) {
		console.error("Failed to get Mastodon session:", err)
		return null
	}
}

/**
 * 認証が必要なAPIのヘルパー関数
 * @param request NextRequest
 * @param handler セッションを受け取る処理関数
 * @returns Response
 */
export const withAuth = async <T>(
	request: NextRequest,
	handler: (session: Session) => Promise<T>,
): Promise<T | Response> => {
	const session = getSession(request)
	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		})
	}

	return handler(session)
}

/**
 * Mastodon認証が必要なAPIのヘルパー関数
 * @param request NextRequest
 * @param handler MastoSessionを受け取る処理関数
 * @returns Response
 */
export const withMastoAuth = async <T>(
	request: NextRequest,
	handler: (session: MastoSession) => Promise<T>,
): Promise<T | Response> => {
	const session = getMastoSession(request)
	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		})
	}

	return handler(session)
}
