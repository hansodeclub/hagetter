"use client"

import React from "react"
import { useSession } from "@/stores"

export const ClientSessionProvider = ({ children }: { children: React.ReactNode }) => {
	const session = useSession()
	
	React.useEffect(() => {
		// useEffect内はクライアントサイドで呼ばれる
		session
			.getAccount()
			.then((_account) => {})
			.catch((err) => {
				console.error(err)
			})
	}, [session])

	return <>{children}</>
}