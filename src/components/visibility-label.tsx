import { PostVisibility } from "@/features/posts/types"
import { cn } from "@/lib/utils"
import React from "react"

const defaultLabelColors = {
	public: "bg-sky-500 text-white font-bold",
	unlisted: "bg-orange-400 text-white font-bold",
	private: "bg-red-400 text-white font-bold",
	draft: "bg-gray-400 text-white font-bold",
}

const defaultLabelNames = {
	public: "公開",
	unlisted: "未収載",
	private: "限定公開",
	draft: "下書き",
}

export interface VisibilityLabelProps
	extends React.HTMLAttributes<HTMLDivElement> {
	visibility: PostVisibility
	labelColors?: typeof defaultLabelColors
	labelNames?: typeof defaultLabelNames
}

export const VisibilityLabel: React.FC<VisibilityLabelProps> = ({
	visibility,
	labelColors = defaultLabelColors,
	labelNames = defaultLabelNames,
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				"w-[5rem] rounded-md px-3 py-1 text-center font-bold text-xs",
				labelColors[visibility],
				className,
			)}
			{...props}
		>
			{labelNames[visibility]}
		</div>
	)
}
