import { getRecentPublicPosts } from "@/features/posts/actions"
import { HomePage } from "@/components/pages/home"

export default async function Home() {
	try {
		const result = await getRecentPublicPosts({ limit: 300 })
		const recentPosts = result.items

		return <HomePage recentPosts={recentPosts} />
	} catch (error) {
		console.error("Failed to load posts:", error)
		return <HomePage error="エラーが発生しました" />
	}
}