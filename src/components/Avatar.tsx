import path from "path"
import Avatar from "@mui/material/Avatar"
import { SxProps } from "@mui/material/styles"
import React from "react"

interface AvatarProps {
	src: string
	acct?: string
	alt: string
	preferOriginal?: boolean
	sx: SxProps
}

export const FallbackAvatar: React.FC<AvatarProps> = ({
	src,
	acct,
	alt,
	sx,
	preferOriginal,
}) => {
	const baseUri = process.env.NEXT_PUBLIC_MEDIA_URL
	if (!baseUri) {
		console.error("NEXT_PUBLIC_MEDIA_URL is not set")
		return null
	}

	const ext = path.extname(src)
	const cachedAvatar = `${baseUri}/avatars/${Buffer.from(src).toString(
		"base64",
	)}${ext}`
	const fallbackAvatar = acct
		? `${baseUri}/avatars/${Buffer.from(acct).toString("base64")}`
		: undefined

	if (preferOriginal) {
		return (
			<Avatar alt={alt} src={src} sx={sx}>
				{acct && (
					<Avatar alt={alt} src={cachedAvatar} sx={sx}>
						<Avatar alt={alt} src={fallbackAvatar} sx={sx} />
					</Avatar>
				)}
				{!acct && <Avatar alt={alt} src={cachedAvatar} sx={sx} />}
			</Avatar>
		)
	}

	return (
		<Avatar alt={alt} src={cachedAvatar} sx={sx}>
			{acct && (
				<Avatar alt={alt} src={fallbackAvatar} sx={sx}>
					<Avatar alt={alt} src={src} sx={sx} />
				</Avatar>
			)}
			{!acct && <Avatar alt={alt} src={src} sx={sx} />}
		</Avatar>
	)
}

export default FallbackAvatar
