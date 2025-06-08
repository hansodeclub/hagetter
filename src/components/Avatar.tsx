import path from "path"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	src: string
	acct?: string
	alt: string
	preferOriginal?: boolean
}

export const FallbackAvatar: React.FC<AvatarProps> = ({
	src,
	acct,
	alt,
	className,
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
		// リモートアバターを優先する
		const srcs = fallbackAvatar
			? [src, cachedAvatar, fallbackAvatar]
			: [src, cachedAvatar]
		return <Avatars srcs={srcs} alt={alt} className={className} />
	} else {
		// キャッシュアバターを優先する
		const srcs = fallbackAvatar
			? [cachedAvatar, fallbackAvatar, src]
			: [cachedAvatar, src]
		return <Avatars srcs={srcs} alt={alt} className={className} />
	}
}

interface AvatarsProps extends React.HTMLAttributes<HTMLDivElement> {
	srcs: string[]
	alt: string
}

export const Avatars: React.FC<AvatarsProps> = ({ srcs, alt, className }) => {
	if (srcs.length === 0) {
		return null
	}

	return (
		<Avatar className={className}>
			<AvatarImage alt={alt} src={srcs[0]} />
			<AvatarFallback>
				<Avatars srcs={srcs.slice(1)} alt={alt} />
			</AvatarFallback>
		</Avatar>
	)
}

export default FallbackAvatar
