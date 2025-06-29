import { notFound } from "next/navigation"
import { Metadata } from "next"

import { queryPosts } from "@/features/posts/actions"
import { UserClient } from "./user-client"

interface PageProps {
	params: Promise<{ uid: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { uid } = await params
	const username = decodeURIComponent(uid)
	
	return {
		title: `${username} の投稿 - Hagetter`,
	}
}

export default async function UserEntries({ params }: PageProps) {
	const { uid } = await params
	const username = decodeURIComponent(uid)
	
	// ユーザー名のパターンチェック
	if (!username || !username.match(/^[^@]+@[^@]+$/)) {
		notFound()
	}

	try {
		const result = await queryPosts({ 
			username, 
			visibility: "public,noindex" 
		})
		
		if (result.items.length === 0) {
			notFound()
		}

		return <UserClient username={username} posts={result.items} />
	} catch (error) {
		console.error("Failed to load user posts:", error)
		notFound()
	}
}