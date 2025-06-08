import { withApi } from "@/features/api/server"
import { getRecentPublicPosts } from "@/features/posts/actions"

const getPosts = withApi(async ({ res }) => {
	const posts = await getRecentPublicPosts({ limit: 10 })
	const tasks = posts.items.map((post) => ({
		id: post.id,
		title: post.title,
		username: post.owner.acct,
	}))

	res.status(200).json({
		count: posts.count,
		items: tasks,
	})
})

export default getPosts
