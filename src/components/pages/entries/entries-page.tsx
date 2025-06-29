import { Pencil as PencilIcon, Trash2 as TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

import { EntryFooter } from "@/components/entry-footer"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { HagetterPostInfo } from "@/features/posts/types"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import { observer, useSession, useStore } from "@/stores"

const EntriesPage = observer(() => {
	const app = useStore()
	const session = useSession()
	const router = useRouter()

	const [loading, setLoading] = React.useState(true)
	const [invoke, setInvoke] = React.useState(false)
	const [posts, setPosts] = React.useState<HagetterPostInfo[]>()

	React.useEffect(() => {
		let unmounted = false
		
		if (session.loading) return
		
		if (!session.account) {
			setLoading(false)
			return
		}
		
		const token = session.token
		if (!token) {
			setLoading(false)
			alert("ログインしてください")
			return
		}
		
		setLoading(true)

		const hagetterClient = new HagetterApiClient()
		hagetterClient
			.getMyPosts(session.account.acct, token)
			.then((result) => {
				if (!unmounted) {
					setPosts(result.items)
					setLoading(false)
				}
			})
			.catch((err) => {
				console.error("Error loading posts:", err)
				const errorMessage = err instanceof Error ? err.message : "投稿の読み込みに失敗しました"
				app.notifyError(new Error(errorMessage))
				setLoading(false)
			})
		return () => {
			unmounted = true
		}
	}, [session.account, invoke])

	const onDeletePost = (id: string) => {
		if (!session.token) return
		if (window.confirm("削除しますか?")) {
			const hagetterClient = new HagetterApiClient()
			hagetterClient
				.deletePost(id, session.token)
				.then((_) => {
					setInvoke(!invoke)
				})
				.catch((err) => {
					console.error("Error deleting post:", err)
					const errorMessage = err instanceof Error ? err.message : "投稿の削除に失敗しました"
					app.notifyError(new Error(errorMessage))
				})
		}
	}

	if (!session.loading && !session.account) {
		return (
			<div className="mx-auto max-w-4xl px-2">
				<h1 className="mt-4 mb-4 font-bold text-xl">投稿の管理</h1>
				<div className="text-center p-8">
					<p>投稿の管理にはログインが必要です。</p>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-4xl px-2">
			<h1 className="mt-4 mb-4 font-bold text-xl">投稿の管理</h1>
			{loading && (
				<div className="flex justify-center p-8">
					<Spinner className="h-8 w-8" />
				</div>
			)}
			{!loading && posts && posts.length === 0 && (
				<div className="text-center p-8">
					<p>投稿はまだありません。</p>
				</div>
			)}
			{!loading &&
				posts &&
				posts.length > 0 &&
				posts.map((post) => (
					<article key={post.id} className="mt-2 flex w-1.0 border-t py-2">
						<div className="grow">
							<div className="mb-2">
								<a href={`/hi/${post.id}`} target="_blank" rel="noreferrer">
									{post.title}
								</a>
							</div>
							<EntryFooter
								visibility={post.visibility}
								createdAt={post.createdAt}
								updatedAt={post.updatedAt}
							/>
						</div>
						<div className="grow-0 basis-24 items-center justify-center">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => router.push(`/edit/${post.id}`)}
							>
								<PencilIcon />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onDeletePost(post.id)}
							>
								<TrashIcon />
							</Button>
						</div>
					</article>
				))}
		</div>
	)
})

export default EntriesPage
