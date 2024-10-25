import React, { HTMLAttributes } from "react"

import {
	PullDownContent,
	PullToRefresh,
	RefreshContent,
	ReleaseContent,
} from "react-js-pull-to-refresh"

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
			className="rounded-[3px] mt-1 mx-auto bg-[#aaa]"
			style={{ width, height }}
			{...rest}
		/>
	)
}

export interface PullNotchProps {
	onRefresh: () => any
	children?: React.ReactNode
	loadMore?: () => any
	invisible?: boolean
}

export const PullNotch: React.FC<PullNotchProps> = ({
	onRefresh,
	children,
	loadMore,
	invisible,
}) => {
	return (
		<PullToRefresh
			pullDownContent={invisible ? <></> : <PullDownContent label="リロード" />}
			releaseContent={<ReleaseContent />}
			refreshContent={<RefreshContent height="100" />}
			pullDownThreshold={100}
			onRefresh={onRefresh}
			triggerHeight={50}
			backgroundColor="white"
		>
			<div id="basic-container">
				<Notch />
				{children}
				{loadMore && (
					<>
						<div className="text-center justify-center w-full p-[30px]">
							<Button onClick={loadMore}>もっと読み込む</Button>
						</div>
					</>
				)}
				<div className="mb-[200px]" />
			</div>
		</PullToRefresh>
	)
}

export default PullNotch
