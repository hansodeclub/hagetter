import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import TextField from "@mui/material/TextField"
import { Theme } from "@mui/material/styles"
import { SystemStyleObject } from "@mui/system"
import React from "react"

import { Toot, isPublic } from "@/components/toot"
import { Status } from "@/features/posts/types"
import { observer, useEditor, useStore, useUrlSearchTimeline } from "@/stores"
import styles from "../editorStyles"

const UrlSearchTimeline: React.FC = observer(() => {
	const store = useUrlSearchTimeline()
	const editor = useEditor()
	const app = useStore()

	const [keyword, setKeyword] = React.useState("")

	const onStatusSelect = (status: Status) => {
		editor.addStatus(status, editor.getAnchor())
		return false
	}

	const onSearch = async (keyword: string) => {
		try {
			await store.search(keyword)
		} catch (err) {
			console.error(err)
			app.notifyError(err)
		}
		//for await (const it of store.search(keyword)) { console.log('it') }
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
			}}
		>
			<Box sx={{ marginTop: 1, mx: 1 }}>
				<TextField
					id="filter-input"
					label={"URL"}
					variant="outlined"
					onChange={(event) => setKeyword(event.target.value)}
					fullWidth
					multiline
					rows={2}
					style={{ backgroundColor: "white", marginTop: 5 }}
				/>
				<Button
					variant="contained"
					color="primary"
					sx={{ mt: 1 }}
					style={{ float: "right" }}
					onClick={() => onSearch(keyword)}
				>
					検索
				</Button>
			</Box>
			<Box
				sx={{
					position: "relative",
					flexGrow: 1,
					marginTop: 1,
				}}
			>
				{store.loading && <LinearProgress sx={styles.progress} />}
				<Box sx={styles.tootSelector}>
					<div id="basic-container">
						{store.statuses.map((status) => (
							<Box
								key={status.id}
								sx={[
									styles.toot as SystemStyleObject<Theme>,
									editor.itemIds.has(status.id) ? { opacity: 0.8 } : {},
								]}
							>
								<Toot
									onClick={onStatusSelect}
									key={status.id}
									status={status}
									preferOriginal
								/>
							</Box>
						))}
					</div>
				</Box>
			</Box>
		</Box>
	)
})

export default UrlSearchTimeline
