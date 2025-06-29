import { getRecentPublicPosts } from "@/features/posts/actions"
import { HomeClient } from "./home-client"

export default async function Home() {
	try {
		const result = await getRecentPublicPosts({ limit: 300 })
		const recentPosts = result.items

		return <HomeClient recentPosts={recentPosts} />
	} catch (error) {
		console.error("Failed to load posts:", error)
		return <HomeClient error="エラーが発生しました" />
	}
}