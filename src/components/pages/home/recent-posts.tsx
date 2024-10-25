import type React from "react"

import { FallbackAvatar } from "@/components/avatar"
import { JapaneseDate, getJapaneseDate } from "@/components/timestamp"

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

import type { HagetterPostInfo } from "@/features/posts/types"

export interface RecentPostsProps extends React.HTMLAttributes<HTMLDivElement> {
	posts: HagetterPostInfo[]
	cursor?: string | null
	error?: string
}

export const RecentPosts: React.FC<RecentPostsProps> = ({
	posts,
	error,
	cursor,
	...rest
}) => {
	if (error) {
		return (
			<div {...rest}>
				<p>エラー：{error}</p>
			</div>
		)
	}

	return (
		<div {...rest}>
			{posts.map((item) => (
				<article
					key={item.id}
					className="relative m-0 min-h-[50px] border-t px-1 py-3 md:px-3"
				>
					{/* biome-ignore lint/a11y/useAnchorContent: overlay link to open article by clicking card */}
					<a
						href={`/hi/${item.id}`}
						tabIndex={-1}
						className="absolute inset-0"
					/>
					<h2 className="text-foreground text-md">
						<a
							href={`/hi/${item.id}`}
							className="relative z-10 hover:underline"
						>
							{item.title}
						</a>
					</h2>
					<footer className="mt-3 flex items-end">
						<div className="flex items-center">
							<a href={`/${item.owner.acct}`} className="relative z-10">
								<FallbackAvatar
									src={item.owner.avatar}
									acct={item.owner.acct}
									alt=""
									sx={{ width: 32, height: 32 }}
								/>
							</a>
							<div className="pl-2">
								<a
									href={`/${item.owner.acct}`}
									className="relative z-10 block hover:underline"
								>
									{item.owner.displayName}
								</a>
							</div>
						</div>
						<div className="grow" />
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<div className="relative z-10 flex items-center text-muted-foreground text-sm">
										<JapaneseDate value={item.createdAt} />
										<div className="w-1">
											{item.updatedAt && (
												<span className="vertical-sub">*</span>
											)}
										</div>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{getJapaneseDate(item.createdAt, true)}に投稿</p>
									{item.updatedAt && (
										<p>{getJapaneseDate(item.updatedAt, true)}に更新</p>
									)}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</footer>
				</article>
			))}
		</div>
	)
}
