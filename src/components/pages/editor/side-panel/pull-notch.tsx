import React, { HTMLAttributes } from "react"

import { Button } from "@/components/ui/button"

export interface NotchProps extends HTMLAttributes<HTMLDivElement> {
	width?: number
	height?: number
}

export const Notch: React.FC<NotchProps> = ({
	width = 40,
	height = 6,
	...rest
}) => {
	return (
		<div
			className="mx-auto mt-1 rounded-[3px] bg-[#aaa]"
			style={{ width, height }}
			{...rest}
		/>
	)
}

export interface PullNotchProps {
	onRefresh: () => void
	children?: React.ReactNode
	loadMore?: () => void
	invisible?: boolean
}

export const PullNotch: React.FC<PullNotchProps> = ({
	onRefresh,
	children,
	loadMore,
	invisible,
}) => {
	return (
		<div id="basic-container">
			{children}
			{loadMore && (
				<div className="w-full justify-center p-[30px] text-center">
					<Button onClick={loadMore}>もっと読み込む</Button>
				</div>
			)}
			<div className="mb-[200px]" />
		</div>
	)
}

export default PullNotch
