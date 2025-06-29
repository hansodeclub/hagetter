"use client"

import { useParams, redirect } from "next/navigation"
import { useEffect } from "react"

export default function UserPostsRedirect() {
	const params = useParams()
	const username = params.username as string

	useEffect(() => {
		if (username) {
			// 旧仕様のURL。/user/[username]/posts から /[username] にリダイレクトする。
			redirect(`/${username}`)
		}
	}, [username])

	return <div>Redirecting...</div>
}