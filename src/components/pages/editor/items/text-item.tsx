import DeleteIcon from "@mui/icons-material/DeleteRounded"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import React from "react"

import MultilineText from "@/components/multiline-text"
import { TextSize } from "@/entities/post"
import { EditorItemType } from "@/stores/editor-item"
import { ItemActionCallback } from "../post-editor"

export const TextItemMenu: React.FC<{
	item: EditorItemType
	onAction: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<Box>
			<IconButton
				aria-label="delete"
				onClick={() => onAction?.(item, { type: "delete" })}
				size="small"
				sx={{ color: "#888", border: "1px solid #aaa" }}
			>
				<DeleteIcon fontSize="small" />
			</IconButton>
		</Box>
	)
}

interface TextItemProps extends React.HTMLAttributes<HTMLDivElement> {
	text: string
	variant: TextSize
	color: string
	onClick?: () => void
	className?: string
}

export const TextItem: React.FC<TextItemProps> = ({
	text,
	variant,
	color,
	onClick,
	className,
}) => (
	<Typography
		variant={variant}
		onClick={onClick}
		color={color}
		className={className}
	>
		<MultilineText text={text} />
	</Typography>
)
