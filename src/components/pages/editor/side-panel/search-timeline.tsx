import React from "react"

import { Toot } from "@/components/toot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProgressLinear } from "@/components/ui/progress-linear"
import { Status } from "@/features/posts/types"
import { cn } from "@/lib/utils"
import { observer, useEditor, useSearchTimeline } from "@/stores"

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
						className="space-y-2"
					>
						<div>
							<Label htmlFor="search-input">検索</Label>
							<Input
								id="search-input"
								placeholder="検索キーワード"
								value={keyword}
								onChange={(event) => setKeyword(event.target.value)}
								className="w-full"
							/>
						</div>
						<Button type="submit" className="w-full">
							検索
						</Button>
					</form>
				</div>
				<div className="mx-1 mt-1">
					<Label htmlFor="filter-input">フィルタ</Label>
					<Input
						id="filter-input"
						placeholder="フィルタ"
						onChange={onChangeFilter}
						className="w-full"
					/>
				</div>
				<div className="relative mt-1 flex grow">
					{store.loading && (
						<ProgressLinear 
							indeterminate 
							className="absolute left-0 top-0 z-10 w-full" 
						/>
					)}
					<div className="-webkit-overflow-scrolling-touch overscroll-behavior-y-none absolute left-0 top-0 h-full w-full grow overflow-y-scroll">
						{store.filteredStatuses.map((status) => (
							<div
								key={status.id}
								className={cn(
									"border-b border-gray-200 pb-1",
									editor.itemIds.has(status.id) ? "opacity-60" : ""
								)}
							>
								<Toot
									onClick={onStatusSelect}
									key={status.id}
									status={status}
									preferOriginal
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	},
)

export default SearchTimeline