"use client"

import { Header } from "@/components/header"
import { HomePage } from "@/components/pages/home"
import type { HagetterPostInfo } from "@/features/posts/types"

interface HomeClientProps {
	recentPosts?: HagetterPostInfo[]
	error?: string
}

export function HomeClient({ recentPosts = [], error }: HomeClientProps) {
	if (error) {
		return (
			<div>
				<Header />
				<div className="p-4">{error}</div>
			</div>
		)
	}

	return (
		<div>
			<Header />
			<HomePage recentPosts={recentPosts} />
		</div>
	)
}