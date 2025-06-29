"use client"

import React from "react"
import { useSession } from "@/stores"

interface AuthClientProps {
	status: "loading" | "success" | "error"
	error?: string
	user?: any
	token?: string
	profile?: any
}

export function AuthClient({ status, error, user, token, profile }: AuthClientProps) {
	const session = useSession()

	React.useEffect(() => {
		if (status === "success" && user && token && profile) {
			session.login(user, token)
			session.setAccount(profile)
			
			// リダイレクト
			setTimeout(() => {
				window.location.href = "/"
			}, 1000)
		}
	}, [status, user, token, profile, session])

	if (status === "error") {
		return <p className="m-4">ログインに失敗しました。({error})</p>
	}
	
	if (status === "success") {
		return (
			<p className="m-4">
				ログイン成功！
				<br />
				リダイレクト中...
			</p>
		)
	}
	
	return <p className="m-4">ログイン中...</p>
}