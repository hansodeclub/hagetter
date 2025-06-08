import {
	BookmarkIcon,
	EarthIcon,
	HomeIcon,
	Link2Icon as LinkIcon,
	SearchIcon,
	StarIcon,
	UsersRoundIcon,
} from "lucide-react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { TimelineName } from "@/entities/timeline"
import { cn } from "@/lib/utils"

interface ItemProps {
	icon: React.ReactNode
	label: string
	value: TimelineName
}

const items: ItemProps[] = [
	{
		icon: <HomeIcon />,
		label: "Home",
		value: "home",
	},
	{
		icon: <UsersRoundIcon />,
		label: "Local",
		value: "local",
	},
	{
		icon: <EarthIcon />,
		label: "Public",
		value: "public",
	},
	{
		icon: <StarIcon />,
		label: "Starred",
		value: "favourites",
	},
	{
		icon: <BookmarkIcon />,
		label: "Bookmarks",
		value: "bookmarks",
	},
	{
		icon: <SearchIcon />,
		label: "Search",
		value: "search",
	},
	{ icon: <LinkIcon />, label: "URL", value: "urls" },
]

export interface TimelinePickerProps {
	timeline?: TimelineName
	setTimeline: (timeline: TimelineName) => void
	toggleDrawer?: () => void
	showTimeline?: boolean
	showBurgerMenu: boolean
}

export const TimelinePicker: React.FC<TimelinePickerProps> = ({
	timeline,
	setTimeline,
	toggleDrawer,
	showTimeline,
}) => {
	const onClick = (value: TimelineName) => {
		if (!showTimeline) {
			// タイムラインが表示されていない場合はドロワーを開く
			toggleDrawer?.()
		}

		setTimeline?.(value)
	}

	return (
		<div className="flex h-full w-full flex-col items-center">
			<Button
				variant="ghost"
				onClick={toggleDrawer}
				size="icon"
				className="h-[48px] w-[48px]"
			>
				{showTimeline ? <ChevronsRight /> : <ChevronsLeft />}
			</Button>

			{items.map(({ icon, label, value }) => (
				<Button
					variant="ghost"
					size="icon"
					key={value}
					onClick={() => onClick(value)}
					className={cn(
						"h-[48px] w-[48px]",
						value === timeline && "text-blue-500 hover:text-blue-500",
					)}
				>
					{icon}
				</Button>
			))}
		</div>
	)
}

export default TimelinePicker
