import TitleIcon from "@mui/icons-material/Title"
import { Fade } from "@mui/material"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import React from "react"

import { leftColumnWidth } from "@/components/pages/editor/post-editor"
import { observer, useEditor } from "@/stores"
import TextEdit from "../edit-items/text-edit"

export interface InsertDividerProps {
	anchor?: string
	isMobile?: boolean
}

export const InsertDivider: React.FC<InsertDividerProps> = observer(
	({ anchor, isMobile }) => {
		const editor = useEditor()
		const [mouseOver, setMouseOver] = React.useState(false)
		const [insertTextMode, setInsertTextMode] = React.useState(false)

		const onInsertText = (text, size, color) => {
			editor.addText(text, size, color, anchor)
			setInsertTextMode(false)
			setMouseOver(false)
		}

		if (insertTextMode) {
			return (
				<Box sx={{ marginLeft: isMobile ? 0 : `${leftColumnWidth}px` }}>
					<TextEdit
						onSubmit={onInsertText}
						onCancel={() => setInsertTextMode(false)}
					/>
				</Box>
			)
		}

		const selector = isMobile ? "&:before" : "&:hover:before"

		return (
			<Box
				sx={{
					height: "32px",
					cursor: "pointer",
					position: "relative",
					marginLeft: isMobile ? 0 : `${leftColumnWidth}px`,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					[selector]: {
						content: "''",
						position: "absolute",
						top: "50%",
						left: "0",
						borderTop: "1px solid rgba(0,0,0,0.2)",
						width: "100%",
						transform: "translateY(-50%)",
						animation: "fadein 0.3s fade-out forwards",
					},
					"@keyframes fadein": {
						"0%": {
							opacity: 0,
						},
						"100%": {
							opacity: 1,
						},
					},
				}}
				onMouseEnter={isMobile ? undefined : () => setMouseOver(true)}
				onMouseLeave={isMobile ? undefined : () => setMouseOver(false)}
			>
				<Fade in={mouseOver || isMobile}>
					<IconButton
						sx={{
							border: isMobile ? "1px solid rgba(0,0,0,0.2)" : "1px solid #888",
							backgroundColor: "white",
							"&:hover": {
								backgroundColor: "#f5f5f5",
							},
						}}
						size="small"
						onClick={() => setInsertTextMode(true)}
					>
						<TitleIcon
							fontSize="small"
							sx={{
								color: isMobile ? "rgba(0,0,0,0.2)" : "#888",
							}}
						/>
					</IconButton>
				</Fade>
			</Box>
		)
	},
)

export default InsertDivider
