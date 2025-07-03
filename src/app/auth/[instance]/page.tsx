import jwt from "jsonwebtoken"

import { AuthPage } from "@/components/pages/auth"
import { signIn } from "@/features/auth/auth"
import { getHost } from "@/lib/utils/server-url"

interface PageProps {
	params: Promise<{ instance: string }>
	searchParams: Promise<{ code?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
	const { instance } = await params
	const { code } = await searchParams
	const host = await getHost()

	if (!instance || !code) {
		return <AuthPage status="error" error="Invalid request" />
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
			<AuthPage status="success" user={user} token={token} profile={profile} />
		)
	} catch (error) {
		console.error("Auth error:", error)
		return (
			<AuthPage
				status="error"
				error={error.message || "Authentication failed"}
			/>
		)
	}
}
