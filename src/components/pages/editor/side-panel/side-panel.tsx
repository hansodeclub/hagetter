import { observer } from "mobx-react-lite"
import React from "react"

import { cn } from "@/lib/utils"
import { useStore } from "@/stores"
import { StatusSelector } from "./status-selector"
import { TimelinePicker } from "./timeline-picker"

export interface SidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
	invisible?: boolean
	toggleInvisible?: () => void
	isTablet?: boolean
	ref?: React.Ref<HTMLDivElement>
}

export const SidePanel: React.FC<SidePanelProps> = observer<
	SidePanelProps,
	HTMLDivElement
>(
	({ invisible, toggleInvisible, isTablet, ...props }, ref) => {
		const store = useStore()

		return (
			<div
				className="pointer-events-none fixed top-0 right-0 z-50 flex h-dvh w-[375px] justify-items-end pt-1 pr-0 pb-[68px]"
				ref={ref}
			>
				<div className="grow" />
				<div
					className="pointer-events-auto flex h-full overflow-hidden rounded-l-xl border border-r-0 bg-background shadow-md"
					ref={ref}
					{...props}
				>
					<div className="w-[48px]">
						<TimelinePicker
							timeline={store.currentTimelineName}
							setTimeline={store.setTimeline}
							toggleDrawer={toggleInvisible}
							showTimeline={!invisible}
							showBurgerMenu={false}
						/>
					</div>
					<div
						className={cn(
							"h-full overflow-hidden bg-white transition-[width] ease-out",
							invisible ? "w-0" : "w-[321px]",
						)}
					>
						<StatusSelector
							timeline={store.currentTimelineName}
							invisible={invisible}
							className="min-w-[321px] pr-2"
						/>
					</div>
				</div>
			</div>
		)
	},
	{ forwardRef: true },
)

export default SidePanel
