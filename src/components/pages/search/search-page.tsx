import React from "react"

import { FallbackAvatar } from "@/components/avatar"
import { Header } from "@/components/header"
import { JapaneseDate, getJapaneseDate } from "@/components/timestamp"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { HagetterPostInfo } from "@/features/posts/types"

export interface HitItem {
	hid: string
	highlightedTitle: string
	highlightedDescription: string
	highlightedContent: string
	post: HagetterPostInfo
}

const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
	return (
		<span
			className="[&_em]:font-bold"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Highligted text has <em> tag (sanitized)
			dangerouslySetInnerHTML={{ __html: text }}
		/>
	)
}

const HitPost: React.FC<{ item: HitItem }> = ({ item }) => {
	const { post } = item

	return (
		<article
			key={post.id}
			className="relative m-0 min-h-[50px] border-t px-1 py-3 md:px-3"
		>
			<h2 className="text-foreground text-md">
				<a href={`/hi/${post.id}`} className="relative z-10 hover:underline">
					<HighlightedText text={item.highlightedTitle} />
				</a>
			</h2>
			<div>
				<HighlightedText text={item.highlightedContent} />
			</div>
			<footer className="mt-3 flex items-end">
				<div className="flex items-center">
					<a href={`/${post.owner.acct}`} className="relative z-10">
						<FallbackAvatar
							src={post.owner.avatar}
							acct={post.owner.acct}
							alt=""
							className="h-8 w-8"
						/>
					</a>
					<div className="pl-2">
						<a
							href={`/${post.owner.acct}`}
							className="relative z-10 block hover:underline"
						>
							{post.owner.displayName}
						</a>
					</div>
				</div>
				<div className="grow" />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<div className="relative z-10 flex items-center text-muted-foreground text-sm">
								<JapaneseDate value={post.createdAt} />
								<div className="w-1">
									{post.updatedAt && <span className="vertical-sub">*</span>}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>{getJapaneseDate(post.createdAt, true)}に投稿</p>
							{post.updatedAt && (
								<p>{getJapaneseDate(post.updatedAt, true)}に更新</p>
							)}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</footer>
		</article>
	)
}

export interface SearchPageProps {
	keyword: string
	items: HitItem[]
}

export const SearchPage: React.FC<SearchPageProps> = ({ items }) => {
	return (
		<div className="mx-auto max-w-4xl">
			{items.map((item) => (
				<HitPost key={item.hid} item={item} />
			))}
		</div>
	)
}
