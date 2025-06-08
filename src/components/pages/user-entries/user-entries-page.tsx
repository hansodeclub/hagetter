import React from "react"

import { FallbackAvatar } from "@/components/avatar"
import { EntryFooter } from "@/components/entry-footer"
import { HagetterPostInfo } from "@/features/posts/types"

export interface UserEntriesPageProps {
	username: string
	posts: HagetterPostInfo[]
}

const UserEntriesPage: React.FC<UserEntriesPageProps> = ({
	username,
	posts,
}) => {
	const owner = posts[0].owner

	return (
		<div className="mx-auto max-w-4xl px-2">
			<div className="mt-4 flex">
				<div>
					<FallbackAvatar
						src={owner.avatar}
						acct={owner.acct}
						alt=""
						className="h-24 w-24"
					/>
				</div>
				<div className="mt-2 ml-8">
					<h1 className="font-bold text-xl">{owner.displayName}</h1>
					<div>{username}</div>
					<div className="mt-2 text-muted-foreground">{posts.length} Posts</div>
				</div>
			</div>
			<div>
				<div className="order-t mt-10">
					{posts.map((post) => (
						<article key={post.id} className="mt-2 flex w-1.0 border-t py-3">
							<div className="grow-1">
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
						</article>
					))}
				</div>
			</div>
		</div>
	)
}

export default UserEntriesPage
