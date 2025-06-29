"use client"

import { Header } from "@/components/header"
import UserEntriesPage from "@/components/pages/user-entries"
import { HagetterPostInfo } from "@/features/posts/types"

interface UserClientProps {
	username: string
	posts: HagetterPostInfo[]
}

export function UserClient({ username, posts }: UserClientProps) {
	return (
		<div>
			<Header />
			<UserEntriesPage username={username} posts={posts} />
		</div>
	)
}