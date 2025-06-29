import jwt from "jsonwebtoken"

import { signIn } from "@/features/auth/auth"
import { getHost } from "@/lib/utils/server-url"
import { AuthClient } from "./auth-client"

interface PageProps {
	params: Promise<{ instance: string }>
	searchParams: Promise<{ code?: string }>
}

export default async function AuthPage({
	params,
	searchParams,
	req,
}: PageProps) {
	const { instance } = await params
	const { code } = await searchParams
	const host = await getHost()

	if (!instance || !code) {
		return <AuthClient status="error" error="Invalid request" />
	}

	try {
		const redirectUri = `${host}/auth/${instance}`
		const { token, profile } = await signIn(code, instance, redirectUri)

		const decodedToken = jwt.decode(token)
		if (!decodedToken || typeof decodedToken !== "object") {
			throw new Error("Invalid token")
		}

		const { user } = decodedToken

		return (
			<AuthClient
				status="success"
				user={user}
				token={token}
				profile={profile}
			/>
		)
	} catch (error) {
		console.error("Auth error:", error)
		return (
			<AuthClient
				status="error"
				error={error.message || "Authentication failed"}
			/>
		)
	}
}
