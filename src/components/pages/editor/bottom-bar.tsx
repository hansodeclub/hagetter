import { ClockArrowDownIcon, EllipsisIcon } from "lucide-react"
import React from "react"

import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { postVisibilityLabels } from "@/entities/post"
import { cn } from "@/lib/utils"
import { observer, useEditor } from "@/stores"

export interface BottomBarProps {
	onSubmit: () => void
	submitting: boolean
	className?: string
}

export const BottomBar: React.FC<BottomBarProps> = observer(
	({ onSubmit, submitting, className }) => {
		const editor = useEditor()
		const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
		const menuOpen = Boolean(anchorEl)
		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchorEl(event.currentTarget)
		}
		const handleClose = () => {
			setAnchorEl(null)
		}

		const handleVisibilityChange = (newValue) => {
			editor.setVisibility(newValue)
		}

		React.useEffect(() => {
			if (
				editor.hasPrivateStatus &&
				["public", "noindex"].includes(editor.visibility)
			)
				editor.setVisibility("unlisted")
		}, [editor.hasPrivateStatus, editor.visibility])

		return (
			<div
				className={cn(
					"fixed right-0 bottom-0 left-0 flex h-[64px] items-center border-gray-200 border-t bg-white px-4 text-black shadow-none",
					className,
				)}
			>
				<div>
					<Button
						color="primary"
						className="w-[140px] rounded-full font-bold"
						onClick={onSubmit}
					>
						{submitting && <Spinner className="mr-2 h-4 w-4" />}
						投稿する
					</Button>
				</div>
				<div className="ml-4 w-[200px]">
					<Select
						value={editor.visibility}
						onValueChange={handleVisibilityChange}
					>
						<SelectTrigger className="rounded-xl">
							<SelectValue placeholder="公開設定">
								{postVisibilityLabels[editor.visibility].label}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className="z-[1200]">
							<SelectItem value="public" disabled={editor.hasPrivateStatus}>
								<p className="font-bold">{postVisibilityLabels.public.label}</p>
								<p className="w-[250px] text-xs">
									{postVisibilityLabels.public.description}
								</p>
							</SelectItem>
							<SelectItem value="noindex" disabled={editor.hasPrivateStatus}>
								<p className="font-bold">
									{postVisibilityLabels.noindex.label}
								</p>
								<p className="w-[250px] text-xs">
									{postVisibilityLabels.noindex.description}
								</p>
							</SelectItem>
							<SelectItem value="unlisted">
								<p className="font-bold">
									{postVisibilityLabels.unlisted.label}
								</p>
								<p className="w-[250px] text-xs">
									{postVisibilityLabels.unlisted.description}
								</p>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="ml-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full"
								//onClick={handleClick}
								aria-controls={menuOpen ? "global-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={menuOpen ? "true" : undefined}
							>
								<EllipsisIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={(_e) => editor.sort()}>
								<ClockArrowDownIcon />
								<span>全体を時系列順でソート</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		)
	},
)

export default BottomBar
