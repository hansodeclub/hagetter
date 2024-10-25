import React from "react"

import LockIcon from "@mui/icons-material/Lock"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { SxProps, Theme } from "@mui/material/styles"

import Avatar from "@/components/avatar"
import Timestamp from "@/components/timestamp"

import emojify, { buildCustomEmojis } from "@/lib/mastodon/emoji"

import { TextSize } from "@/entities/post"
import { Status } from "@/features/posts/types"

import Media from "./media"
import Poll from "./poll"

const styles: any = {
	root: {
		display: "flex",
	},
	selected: {
		backgroundColor: "#ffeeee",
	},
	disabled: {
		//backgroundColor: '#eeeeee'
	},
	avatar: {
		width: "48px",
		height: "48px",
		borderRadius: "5px",
	},
	right: {
		display: "flex",
		flexDirection: "column",
		padding: 1,
		paddingLeft: 0,
		flexGrow: 1,
		minWidth: 0,
		maxWidth: "100%",
	},
	lock: {
		fontSize: "20px",
		color: "#ff4040",
	},
	acct: {
		paddingLeft: 1,
		color: "#666",
		minWidth: 0,
		maxWidth: "100%",
		flexGrow: 1,
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		wordBreak: "break-all",
	},
	noWrap: {},

	body: {
		minHeight: "30px",
		wordBreak: "break-all",
		"& a": {
			color: "#4040ff",
			textDecoration: "none",
		},
		"& a:hover": {
			color: "#ff4040",
			textDecoration: "underline",
		},
		"& p": {
			wordBreak: "break-word",
		},
	},
	footer: {
		display: "flex",
		alignItem: "middle",
		justifyContent: "flex-end",
		"& a": {
			textDecoration: "none",
			color: "#888",
		},
		"& a:hover": {
			textDecoration: "underline",
			color: "#888",
		},
	} as SxProps<Theme>,
}

export interface StatusProps {
	status: Status
	selected?: boolean
	disabled?: boolean
	color?: string
	variant?: TextSize
	onClick?: (status: Status) => any
	className?: string
	missingAvatar?: string
	sx?: SxProps<Theme>
	preferOriginal?: boolean
}

export const isPublic = (visibility) => {
	return visibility === "public" || visibility === "unlisted"
}

export const Toot: React.FC<StatusProps> = ({
	status,
	variant,
	color,
	selected,
	onClick,
	className,
	disabled,
	missingAvatar = "/images/missing.png",
	sx,
	preferOriginal,
}) => {
	return (
		<Box
			onClick={() => onClick?.(status)}
			typography="body2"
			sx={[
				styles.root,
				!disabled && selected && styles.selected,
				disabled && styles.disabled,
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<div className="p-1">
				<div>
					<Avatar
						alt={status.account.displayName || status.account.username}
						src={status.account.avatar}
						acct={status.account.acct}
						sx={styles.avatar}
						preferOriginal={preferOriginal}
					/>
				</div>
			</div>
			<Box sx={styles.right}>
				<div className="flex w-full items-center">
					<div className="shrink-0">
						{status.account.displayName || status.account.username}
					</div>
					<Box sx={styles.acct}>{status.account.acct}</Box>
				</div>
				<Box sx={styles.body}>
					{variant && (
						<Typography
							variant={variant}
							style={{ color: color }}
							component="div"
						>
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized
								dangerouslySetInnerHTML={{
									__html: emojify(
										status.content,
										buildCustomEmojis(status.emojis),
									),
								}}
							/>
						</Typography>
					)}
					{!variant && (
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized
							dangerouslySetInnerHTML={{
								__html: emojify(
									status.content,
									buildCustomEmojis(status.emojis),
								),
							}}
						/>
					)}
				</Box>
				<div className="max-w-full">
					<Media attachments={status.mediaAttachments} />
				</div>
				{status.poll && (
					<div className="max-w-full">
						<Poll poll={status.poll} />
					</div>
				)}
				<Box sx={styles.footer}>
					<a href={status.url || undefined} target="_blank" rel="noreferrer">
						<Timestamp className="text-gray-500" value={status.createdAt} />
					</a>

					<Box sx={styles.displayName}>
						{!isPublic(status.visibility) && (
							<LockIcon sx={styles.lock} color="action" />
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default Toot
