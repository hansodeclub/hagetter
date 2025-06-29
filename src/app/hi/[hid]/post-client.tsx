"use client"

import { Header } from "@/components/header"
import PostContent from "@/components/pages/post/post-content"
import { AnyPost } from "@/components/social/any-post"

interface PostClientProps {
	post?: any
	error?: string
}

export function PostClient({ post, error }: PostClientProps) {
	if (error || !post) {
		return (
			<div>
				<Header />
				<div className="flex">
					<div className="hidden sm:mt-2 sm:ml-2 sm:block">
						<AnyPost />
					</div>
					<div className="mt-2 w-full bg-white p-2 sm:m-2 sm:max-w-screen-sm sm:rounded sm:border">
						<p>エラー：{error ?? "投稿が見つかりません"}</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			<Header />
			<div className="flex">
				<div className="hidden sm:mt-2 sm:ml-2 sm:block">
					<AnyPost />
				</div>
				<div className="mt-2 w-full bg-white p-2 sm:m-2 sm:max-w-screen-sm sm:rounded sm:border">
					<PostContent post={post} />
				</div>
			</div>
		</div>
	)
}