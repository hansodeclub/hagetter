import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import TextField from "@mui/material/TextField"
import { Theme } from "@mui/material/styles"
import { SystemStyleObject } from "@mui/system"
import React from "react"

import { Toot, isPublic } from "@/components/toot"
import { Status } from "@/features/posts/types"
import { observer, useEditor, useTimeline } from "@/stores"
import styles from "../editorStyles"
import PullNotch from "./pull-notch"

export interface TimelineProps {
	name: string
	invisible?: boolean
	setInvisible?: (invisible: boolean) => void
}

const Timeline: React.FC<TimelineProps> = observer(({ name, invisible }) => {
	const store = useTimeline(name)
	const editor = useEditor()
	const itemIds = editor.itemIds
	React.useEffect(() => {
		if (store.init) {
			store.reload().catch(console.error)
		}
	}, [])

	const onStatusSelect = (status: Status) => {
		editor.addStatus(status, editor.getAnchor())
		return false
	}

	const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		store.setFilter(event.target.value)
	}

	const onRefresh = async () => {
		try {
			await store.reload()
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="flex h-full w-full flex-col">
			<div className="mx-1 mt-1">
				<TextField
					id="filter-input"
					label={"フィルタ"}
					variant="outlined"
					onChange={onChangeFilter}
					fullWidth
					sx={{ backgroundColor: "white" }}
				/>
			</div>
			<div className="relative mt-1 grow">
				{store.loading && <LinearProgress sx={styles.progress} />}
				<Box sx={styles.tootSelector}>
					<PullNotch
						onRefresh={onRefresh}
						invisible={invisible}
						loadMore={
							!store.init && !store.loading
								? () => store.loadMore(false)
								: undefined
						}
					>
						{store.filteredStatuses.map((status) => (
							<Box
								key={status.id}
								sx={[
									styles.toot as SystemStyleObject<Theme>,
									itemIds.has(status.id)
										? {
												opacity: 0.6,
											}
										: {},
								]}
							>
								<Toot
									onClick={onStatusSelect}
									key={status.id}
									status={status}
									disabled={!isPublic(status.visibility)}
									preferOriginal
								/>
							</Box>
						))}
					</PullNotch>
				</Box>
			</div>
		</div>
	)
})

export default Timeline
