import React from "react"

import { TextItem } from "@/components/item/text-item"
import { Toot } from "@/components/toot"
import { HagetterItem } from "@/entities/post"

export interface PostItemProps extends React.HTMLAttributes<HTMLDivElement> {
	item: HagetterItem
}

export const PostItem: React.FC<PostItemProps> = ({ item, className }) => {
	if (item.type === "status") {
		return (
			<Toot
				variant={item.size}
				color={item.color}
				status={item.data}
				className={className}
			/>
		)
	} else if (item.type === "text") {
		return (
			<TextItem
				text={item.data.text}
				variant={item.size}
				color={item.color}
				className={className}
			/>
		)
	} else {
		throw Error(`Unknown item type: ${item.type}`)
	}
}

export default PostItem
