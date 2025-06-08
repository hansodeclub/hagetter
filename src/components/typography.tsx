import React from "react"

import { TextSize } from "@/entities/post"
import { cn } from "@/lib/utils"

export interface TypographyProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: TextSize
	color?: string
	color2?: string
}

export const Typography: React.FC<TypographyProps> = ({
	className,
	size,
	color,
	color2,
	style,
	children,
	...props
}) => {
	const coloredStyle = style ? { ...style, color } : { color }
	return (
		<div
			className={cn(textSizeToClassName(size), className)}
			style={coloredStyle}
			{...props}
		>
			{children}
		</div>
	)
}

const textSizeToClassName = (size?: TextSize) => {
	// MUIのテキストサイズをTailwindCSSのクラスに変換する
	if (!size) return "text-sm"
	switch (size) {
		case "inherit":
			return "text-sm"
		case "h1":
			return "text-6xl"
		case "h2":
			return "text-5xl"
		case "h3": // 48px
			return "text-4xl"
		case "h4":
			return "text-3xl"
		case "h5":
			return "text-2xl"
		case "h6": // 20px
			return "text-xl"
	}
}

export const MultilineText = ({ text }: { text: string }) => {
	const texts = text.split(/(\n)/).map((item, index) => {
		return (
			<React.Fragment key={`${index}-${item}`}>
				{item.match(/\n/) ? <br /> : item}
			</React.Fragment>
		)
	})
	return <>{texts}</>
}

export default Typography
