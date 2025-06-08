import React from "react"

import { PollResult } from "@/features/posts/types"
import { cn } from "@/lib/utils"

export interface PollProps {
	onRefresh?: () => void
	poll: PollResult
}

const PollValue: React.FC<{
	title: string
	percentage: number
	highest?: boolean
}> = ({ title, percentage, highest }) => {
	const percentageString = `${(percentage * 100).toFixed(0)}%`

	return (
		<div className="mt-2">
			<div className="flex items-center">
				<div className="mr-2 w-16 font-bold">{percentageString}</div>
				<div>{title}</div>
			</div>
			<div className="max-w-[640px]">
				<div
					className={cn(
						highest ? "bg-blue-400" : "bg-blue-200",
						`w-[${percentageString}]`,
						"mt-[1px] h-[7px] min-w-[5px] rounded-[2px]",
					)}
				/>
			</div>
		</div>
	)
}

export const Poll: React.FC<PollProps> = ({ poll, onRefresh }) => {
	const total = poll.votesCount
	const maxValue = poll.options.reduce((acc, cur) => {
		if (cur.votesCount > acc || acc === -1) {
			return cur.votesCount
		}
		return acc
	}, -1)

	return (
		<div>
			<div>
				{poll.options.map((option, i) => (
					<PollValue
						key={i}
						title={option.title}
						percentage={option.votesCount / total}
						highest={option.votesCount === maxValue}
					/>
				))}
			</div>
			<div className="mt-2 flex text-gray-400">
				{onRefresh && (
					<div
						onClick={() => onRefresh()}
						className="mr-1 cursor-pointer underline"
					>
						<a>更新</a>
					</div>
				)}
				<div>{poll.votersCount}人</div>
				<div>·{poll.expired ? <span>終了</span> : <span>投票中</span>}</div>
			</div>
		</div>
	)
}

export default Poll
