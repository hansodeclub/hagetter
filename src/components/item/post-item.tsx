import React from "react"

import { observer } from "mobx-react-lite"

import Typography from "@mui/material/Typography"
import { SxProps, Theme } from "@mui/material/styles"

import { Status, TextSize } from "@/features/posts/types"
import { EditorItemType } from "@/stores/editor-item"

import { Toot } from "@/components/toot"

const styles: { [key: string]: SxProps<Theme> } = {
	toot: {
		borderBottom: "1px solid #cccccc",
	},
}

interface TextItemProps {
	text: string
	variant: TextSize
	color: string
	selected?: boolean
	onClick?: () => any
}

const MultilineText = ({ text }) => {
	const texts = text.split(/(\n)/).map((item, index) => {
		return (
			<React.Fragment key={index}>
				{item.match(/\n/) ? <br /> : item}
			</React.Fragment>
		)
	})
	return <>{texts}</>
}

export const TextItem: React.FC<TextItemProps> = ({
	text,
	variant,
	color,
	selected,
	onClick,
}) => (
	<li style={{ display: "inline", padding: 0, margin: 0 }}>
		<Typography
			variant={variant}
			onClick={onClick && (() => onClick())}
			sx={{
				margin: 0,
				padding: "5px 10px",
				backgroundColor: selected ? "#ffeeee" : "#ffffff",
				color: color,
			}}
		>
			<MultilineText text={text} />
		</Typography>
	</li>
)

export interface PostItemProps {
	item: EditorItemType
	onClick?: (item: EditorItemType) => void
	preferOriginal?: boolean
}

const PostItem: React.FC<PostItemProps> = observer(
	({ item, onClick, preferOriginal }) => {
		if (item.data.type === "status") {
			const status = item.data.data
			return (
				<li style={{ display: "inline" }}>
					<Toot
						variant={item.size}
						color={item.color}
						onClick={onClick && (() => onClick(item))}
						selected={item.selected}
						status={status}
						sx={styles.toot}
						preferOriginal={preferOriginal}
					/>
				</li>
			)
		} else if (item.data.type === "text") {
			const textItem = item.data.data
			return (
				<TextItem
					text={textItem.text}
					variant={item.size || "inherit"}
					color={item.color || "black"} // TODO: デフォルトの色を定義する
					selected={item.selected}
					onClick={onClick && (() => onClick(item))}
				/>
			)
		} else {
			throw Error(`Unknown item type: ${item.type}`)
		}
	},
)

export default PostItem
