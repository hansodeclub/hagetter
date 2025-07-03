import { getPost } from "@/features/posts/actions"
import { PostContent } from "@/components/pages/post/post-content"

interface PostPageProps {
	params: Promise<{ hid: string }>
}

export default async function PostPage({ params }: PostPageProps) {
	const { hid } = await params

	try {
		const post = await getPost(hid)
		
		if (!post) {
			return <PostContent error="投稿が見つかりません" />
		}

		return <PostContent post={post} />
	} catch (error) {
		console.error("Failed to load post:", error)
		return <PostContent error="エラーが発生しました" />
	}
}