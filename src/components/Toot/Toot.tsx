import { Lock as LockIcon } from "lucide-react"
import React from "react"

import Avatar from "@/components/avatar"
import Timestamp from "@/components/timestamp"
import { Typography } from "@/components/typography"
import { TextSize } from "@/entities/post"
import { Status } from "@/features/posts/types"
import emojify, { buildCustomEmojis } from "@/lib/mastodon/emoji"
import { cn } from "@/lib/utils"
import Media from "./media"
import Poll from "./poll"

export interface StatusProps {
	status: Status
	color?: string
	color2?: string
	variant?: TextSize
	onClick?: (status: Status) => void
	className?: string
	missingAvatar?: string
	preferOriginal?: boolean
}

export const isPublic = (visibility) => {
	return visibility === "public" || visibility === "unlistd"
}

export const Toot: React.FC<StatusProps> = ({
	status,
	variant,
	color,
	color2,
	onClick,
	className,
	preferOriginal,
}) => {
	return (
		<div
			onClick={() => onClick?.(status)}
			className={cn("flex text-sm", className)}
		>
			<div className="p-1">
				<Avatar
					alt={status.account.displayName || status.account.username}
					src={status.account.avatar}
					acct={status.account.acct}
					className="size-12 rounded-md"
					preferOriginal={preferOriginal}
				/>
			</div>
			<div className="flex min-w-0 max-w-full grow flex-col pl-1">
				<div className="flex w-full items-center">
					<div className="shrink-0">
						{status.account.displayName || status.account.username}
					</div>
					<div className="ml-2 min-w-0 max-w-full grow overflow-hidden text-ellipsis whitespace-nowrap break-all text-gray-500">
						{status.account.acct}
					</div>
				</div>
				<div
					className="mt-1 min-h-8 break-words [&>a]:no-underline [&_a:hover]:text-red-500 [&_a:hover]:underline [&_a]:text-blue-500 [&_p]:break-words"
				>
					<Typography
						size={variant}
						color={color}
						color2={color2}
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized
						dangerouslySetInnerHTML={{
							__html: emojify(status.content, buildCustomEmojis(status.emojis)),
						}}
					/>
				</div>
				<div className="max-w-full">
					<Media attachments={status.mediaAttachments} />
				</div>
				{status.poll && (
					<div className="max-w-full">
						<Poll poll={status.poll} />
					</div>
				)}
				<div className="flex items-center justify-end">
					<div className="grow" />
					<div>
						<a
							href={status.url || undefined}
							target="_blank"
							rel="noreferrer"
							className="text-gray-500 no-underline hover:underline"
						>
							<Timestamp value={status.createdAt} />
						</a>
					</div>

					{!isPublic(status.visibility) && (
						<div>
							<LockIcon className="ml-1 size-4 text-red-500" />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Toot
