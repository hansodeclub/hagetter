import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import TextField from "@mui/material/TextField"
import { Theme } from "@mui/material/styles"
import { SystemStyleObject } from "@mui/system"
import React from "react"

import { Toot } from "@/components/toot"
import { Status } from "@/features/posts/types"
import { observer, useEditor, useSearchTimeline } from "@/stores"
import styles from "../editorStyles"

const SearchTimeline: React.FC<{ invisible?: boolean }> = observer(
	({ invisible }) => {
		const store = useSearchTimeline()
		const editor = useEditor()

		const [keyword, setKeyword] = React.useState("")
		const onSearch = async (keyword: string) => {
			await store.search(keyword)
			//for await (const it of store.search(keyword)) { console.log('it') }
		}
		const onStatusSelect = (status: Status) => {
			editor.addStatus(status, editor.getAnchor())
			return false
		}

		const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
			store.setFilter(event.target.value)
		}

		return (
			<div className="flex h-full w-full flex-col">
				<div className="mx-1 mt-1">
					<form
						onSubmit={(event) => {
							event.preventDefault()
							onSearch(keyword)
							return false
						}}
					>
						<TextField
							id="filter-input"
							label={"検索"}
							variant="outlined"
							onChange={(event) => setKeyword(event.target.value)}
							fullWidth
						/>
					</form>
				</div>
				<div className="mx-1 mt-1">
					<TextField
						id="filter-input"
						label={"フィルタ"}
						variant="outlined"
						onChange={onChangeFilter}
						fullWidth
					/>
				</div>
				<div className="relative mt-1 flex grow">
					{store.loading && <LinearProgress sx={styles.progress} />}
					<Box sx={styles.tootSelector}>
						{store.filteredStatuses.map((status) => (
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
					</Box>
				</div>
			</div>
		)
	},
)

export default SearchTimeline
