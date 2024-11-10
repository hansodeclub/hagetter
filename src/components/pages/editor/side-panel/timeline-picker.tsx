import BookmarkIcon from "@mui/icons-material/BookmarkOutlined"
import HomeIcon from "@mui/icons-material/HomeRounded"
import LinkIcon from "@mui/icons-material/LinkRounded"
import PeopleIcon from "@mui/icons-material/PeopleRounded"
import PublicIcon from "@mui/icons-material/PublicRounded"
import SearchIcon from "@mui/icons-material/SearchRounded"
import StarIcon from "@mui/icons-material/StarRounded"
import { ListItemIcon } from "@mui/material"
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { TimelineName } from "@/entities/timeline"

interface ItemProps {
	icon: React.ReactNode
	label: string
	value: TimelineName
}

const items: ItemProps[] = [
	{
		icon: <HomeIcon sx={{ fontSize: "28px" }} />,
		label: "Home",
		value: "home",
	},
	{
		icon: <PeopleIcon sx={{ fontSize: "28px" }} />,
		label: "Local",
		value: "local",
	},
	{
		icon: <PublicIcon sx={{ fontSize: "28px" }} />,
		label: "Public",
		value: "public",
	},
	{
		icon: <StarIcon sx={{ fontSize: "28px" }} />,
		label: "Starred",
		value: "favourites",
	},
	{
		icon: <BookmarkIcon sx={{ fontSize: "28px" }} />,
		label: "Bookmarks",
		value: "bookmarks",
	},
	{
		icon: <SearchIcon sx={{ fontSize: "28px" }} />,
		label: "Search",
		value: "search",
	},
	{ icon: <LinkIcon sx={{ fontSize: "28px" }} />, label: "URL", value: "urls" },
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
		if (toggleDrawer) {
			// 同じタイムラインを選択した場合か、タイムラインが表示されていない場合はドロワーをトグルする
			if ((showTimeline && value === timeline) || !showTimeline) {
				toggleDrawer()
			}
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
					className="h-[48px] w-[48px]"
				>
					<ListItemIcon
						sx={{
							minWidth: 0,
							justifyContent: "center",
							color: value === timeline ? "#2196f3" : "inherit",
						}}
					>
						{icon}
					</ListItemIcon>
				</Button>
			))}
		</div>
	)
}

export default TimelinePicker
