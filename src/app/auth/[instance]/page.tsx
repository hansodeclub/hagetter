import jwt from "jsonwebtoken"

import { AuthPage } from "@/components/pages/auth"
import { OAuthSignIn } from "@/features/auth/signin"
import { getInstanceSecret } from "@/features/instances/actions"
import { getHost } from "@/lib/utils/server-url"

export interface PageProps {
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
		const instanceInfo = await getInstanceSecret(instance)
		if (!instanceInfo) {
			throw new Error(`Unable to find instance: ${instance}`)
		}

		const { token, profile } = await OAuthSignIn(
			instanceInfo.name,
			instanceInfo.server,
			instanceInfo.clientId,
			instanceInfo.clientSecret,
			instanceInfo.sns,
			code,
			redirectUri,
		)

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
