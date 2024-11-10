import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import SortIcon from "@mui/icons-material/Sort"
import LoadingButton from "@mui/lab/LoadingButton"
import { ListItemIcon, Menu, MenuItem } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import React from "react"

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { observer, useEditor, useSession } from "@/stores"
import { VisibilityTooltip } from "./visibility-tooltip"

export const BottomBar: React.FC<{ onSubmit: () => any; submitting: boolean }> =
	observer(({ onSubmit, submitting }) => {
		const editor = useEditor()
		const session = useSession()
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
				["public", "unlisted"].includes(editor.visibility)
			)
				editor.setVisibility("private")
		}, [editor.hasPrivateStatus])

		const handleUnlistedChange = (event) => {
			if (editor.hasPrivateStatus) {
				editor.setVisibility("unlisted")
			} else {
				editor.setVisibility(event.target.checked ? "unlisted" : "public")
			}
		}

		return (
			<AppBar
				position="fixed"
				sx={{
					top: "auto",
					bottom: 0,
					backgroundColor: "#fff",
					color: "#000",
					borderTop: "1px solid #ddd",
					boxShadow: "none",
				}}
			>
				<Toolbar>
					<LoadingButton
						variant="contained"
						color="primary"
						size="large"
						sx={{ borderRadius: "30px", width: 140, fontWeight: 800 }}
						loadingPosition="start"
						loading={submitting}
						onClick={onSubmit}
					>
						投稿する
					</LoadingButton>
					<div className="ml-4 w-[200px]">
						<Select
							value={editor.visibility}
							onValueChange={handleVisibilityChange}
						>
							<SelectTrigger className="rounded-xl">
								<SelectValue placeholder="公開設定" />
								<SelectContent className="z-[1200]">
									<SelectItem value="public" disabled={editor.hasPrivateStatus}>
										公開
									</SelectItem>
									<SelectItem
										value="unlisted"
										disabled={editor.hasPrivateStatus}
									>
										未収載
									</SelectItem>
									<SelectItem value="private">限定公開</SelectItem>
									<SelectItem value="draft">下書き</SelectItem>
								</SelectContent>
							</SelectTrigger>
						</Select>
					</div>
					<div className="ml-2">
						<Popover>
							<PopoverTrigger asChild>
								<InfoCircledIcon className="h-6 w-6 text-gray-800" />
							</PopoverTrigger>
							<PopoverContent className="z-[1200]">
								{/* AppBar has z-index: 1100 */}
								<VisibilityTooltip
									username={session.account ? session.account.acct : undefined}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div>
						<IconButton
							id="global-menu-button"
							size="small"
							sx={{ border: "1px solid #aaa" }}
							onClick={handleClick}
							aria-controls={menuOpen ? "global-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={menuOpen ? "true" : undefined}
						>
							<MoreHorizIcon fontSize="small" />
						</IconButton>
						<Menu
							id="global-menu"
							open={menuOpen}
							anchorEl={anchorEl}
							anchorOrigin={{ vertical: "top", horizontal: "left" }}
							transformOrigin={{ vertical: "bottom", horizontal: "left" }}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "global-menu-button",
							}}
						>
							<MenuItem
								onClick={() => {
									editor.sort()
									handleClose()
								}}
							>
								<ListItemIcon>
									<SortIcon fontSize="small" />
								</ListItemIcon>
								全体を時系列順でソート
							</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		)
	})

export default BottomBar
