import { getPost } from "@/features/posts/actions"
import { PostClient } from "./post-client"

interface PostPageProps {
	params: Promise<{ hid: string }>
}

export default async function PostPage({ params }: PostPageProps) {
	const { hid } = await params

	try {
		const post = await getPost(hid)
		
		if (!post) {
			return <PostClient error="投稿が見つかりません" />
		}

		return <PostClient post={post} />
	} catch (error) {
		console.error("Failed to load post:", error)
		return <PostClient error="エラーが発生しました" />
	}
}