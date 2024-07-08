import type React from "react"

import { FallbackAvatar } from "@/components/Avatar"
import { JapaneseDate, getJapaneseDate } from "@/components/Timestamp"

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
					className="border-t min-h-[50px] m-0 p-3 relative"
				>
					{/* biome-ignore lint/a11y/useAnchorContent: overlay link to open article by clicking card */}
					<a
						href={`/hi/${item.id}`}
						tabIndex={-1}
						className="absolute inset-0"
					/>
					<h2 className="font-bold text-foreground text-md">
						<a
							href={`/hi/${item.id}`}
							className="hover:underline relative z-10"
						>
							{item.title}
						</a>
					</h2>
					<footer className="flex mt-3 items-end">
						<div className="flex items-center">
							<a href={`/users/${item.owner.acct}`} className="relative z-10">
								<FallbackAvatar
									src={item.owner.avatar}
									acct={item.owner.acct}
									alt=""
									sx={{ width: 32, height: 32 }}
								/>
							</a>
							<div className="pl-2">
								<a
									href={`/users/${item.owner.acct}`}
									className="hover:underline block relative z-10"
								>
									{item.owner.displayName}
								</a>
							</div>
						</div>
						<div className="grow" />
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<div className="flex items-center text-muted-foreground text-sm relative z-10">
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
