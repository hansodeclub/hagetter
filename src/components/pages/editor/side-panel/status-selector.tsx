import React from "react"

import { Button } from "@/components/ui/button"
import { TimelineName } from "@/entities/timeline"
import { cn } from "@/lib/utils"
import { useStore } from "@/stores"
import { RotateCw as RotateCwIcon } from "lucide-react"
import { observer } from "mobx-react-lite"
import SearchTimeline from "./search-timeline"
import Timeline from "./timeline"
import UrlSearchTimeline from "./url-search-timeline"

export interface StatusSelectorProps
	extends React.HTMLAttributes<HTMLDivElement> {
	timeline?: TimelineName
	invisible?: boolean
}

export const StatusSelector: React.FC<StatusSelectorProps> =
	observer<StatusSelectorProps>(({ timeline, invisible, className }) => {
		const store = useStore()
		return (
			<div className={cn("h-full w-full min-w-[321px]", className)}>
				<div className="flex h-[48px] items-center px-1">
					{timeline !== undefined && (
						<p className="font-black text-lg text-muted-foreground">
							{store.currentTimelineLabel}
						</p>
					)}
					<div className="grow" />
					{store.currentTimeline?.canReload && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => store.currentTimeline?.reload()}
						>
							<RotateCwIcon className="h-6 w-6 text-muted-foreground" />
						</Button>
					)}
				</div>
				{timeline === "home" && (
					<Timeline name={timeline} invisible={invisible} />
				)}
				{timeline === "local" && (
					<Timeline name={timeline} invisible={invisible} />
				)}
				{timeline === "public" && (
					<Timeline name={timeline} invisible={invisible} />
				)}
				{timeline === "favourites" && (
					<Timeline name={timeline} invisible={invisible} />
				)}
				{timeline === "bookmarks" && (
					<Timeline name={timeline} invisible={invisible} />
				)}
				{timeline === "search" && <SearchTimeline invisible={invisible} />}
				{timeline === "urls" && <UrlSearchTimeline />}
				{timeline === undefined && <HowTo />}
			</div>
		)
	})

const HowTo: React.FC = () => {
	return (
		<div className="m-3 bg-gray-100 p-2">
			<p className="text-center font-semibold">使い方</p>
			<ul className="mt-3 list-inside list-disc">
				<li>タイムラインからまとめるやつを探しましょう</li>
				<li>クリックでまとめに追加されます</li>
				<li>まとめには大きな責任が伴います</li>
			</ul>
		</div>
	)
}

export default StatusSelector
