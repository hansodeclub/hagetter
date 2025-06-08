import React from "react"

import { MultilineText, Typography } from "@/components/typography"
import { TextSize } from "@/entities/post"

interface TextItemProps extends React.HTMLAttributes<HTMLDivElement> {
	text: string
	variant: TextSize
	color: string
	color2?: string
	selected?: boolean
	onClick?: () => void
}

export const TextItem: React.FC<TextItemProps> = ({
	text,
	variant,
	color,
	color2,
	onClick,
	className,
}) => (
	<Typography
		size={variant}
		onClick={onClick}
		color={color}
		color2={color2}
		className={className}
	>
		<MultilineText text={text} />
	</Typography>
)

export default TextItem
