import React from "react"

import { observer } from "mobx-react-lite"
import { useRouter } from "next/router"

import Avatar from "@/components/avatar"
import { TextItem } from "@/components/item/post-item"
import Timestamp from "@/components/timestamp"
import { Toot } from "@/components/toot"
import { Button } from "@/components/ui/button"
import { HagetterItem } from "@/features/posts/types"

import { HagetterPost, Status } from "@/features/posts/types"
import { useSession } from "@/stores"

export interface PostContentProps {
	post: HagetterPost
}

const PostContent = observer<PostContentProps>(({ post }) => {
	const session = useSession()
	const router = useRouter()
	const isOwner =
		session.loggedIn &&
		session.account &&
		session.account.acct === post.owner.acct

	return (
		<div>
			<h1 className="font-bold text-2xl">{post.title}</h1>
			<div className="my-2">{post.description}</div>
			<div className="flex items-center align-middle">
				<div>
					<a href={`/${post.owner.acct}`} target="_blank" rel="noreferrer">
						<Avatar
							src={post.owner.avatar}
							acct={post.owner.acct}
							alt=""
							sx={{
								width: 32,
								height: 32,
							}}
						/>
					</a>
				</div>
				<div className="ml-2">
					<a
						href={`/${post.owner.acct}`}
						target="_blank"
						rel="noreferrer"
						className="text-black no-underline hover:text-orange-400 hover:underline"
					>
						{post.owner.displayName}
					</a>
				</div>
				<div className="grow" />
				<div>
					<Timestamp
						value={post.createdAt}
						className="text-base text-gray-500"
						showSeconds={false}
					/>
				</div>
				{isOwner && (
					<div className="ml-1">
						<Button
							variant="secondary"
							onClick={() => router.push(`/edit/${post.id}`)}
						>
							編集
						</Button>
					</div>
				)}
			</div>
			<hr className="mt-2 mb-3" />
			<div>
				{post.contents.map((item) => (
					<PostItem key={item.id} item={item} />
				))}
			</div>
		</div>
	)
})

const PostItem: React.FC<{
	item: HagetterItem
}> = ({ item }) => {
	if (item.type === "status") {
		return (
			<Toot
				variant={item.size}
				color={item.color}
				status={item.data as Status}
			/>
		)
	} else if (item.type === "text") {
		return (
			<TextItem text={item.data.text} variant={item.size} color={item.color} />
		)
	} else {
		throw Error(`Unknown item type: ${item.type}`)
	}
}

export default PostContent
