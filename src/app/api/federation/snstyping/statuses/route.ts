import { NextRequest, NextResponse } from "next/server"

import { getRecentPublicPosts } from "@/features/posts/actions"

export async function GET(request: NextRequest) {
	try {
		const posts = await getRecentPublicPosts({ limit: 10 })
		const tasks = posts.items.map((post) => ({
			id: post.id,
			title: post.title,
			username: post.owner.acct,
		}))

		return NextResponse.json({
			count: posts.count,
			items: tasks,
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}