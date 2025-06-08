import React from "react"

import { Toot } from "@/components/toot"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ProgressLinear } from "@/components/ui/progress-linear"
import { Textarea } from "@/components/ui/textarea"
import { Status } from "@/features/posts/types"
import { cn } from "@/lib/utils"
import { observer, useEditor, useStore, useUrlSearchTimeline } from "@/stores"

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
		<div className="flex h-full w-full flex-col">
			<div className="mx-1 mt-1">
				<div className="space-y-2">
					<div>
						<Label htmlFor="url-input">URL</Label>
						<Textarea
							id="url-input"
							placeholder="URLを入力してください"
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
							rows={2}
							className="w-full bg-white"
						/>
					</div>
					<Button 
						onClick={() => onSearch(keyword)}
						className="w-full"
					>
						検索
					</Button>
				</div>
			</div>
			<div className="relative mt-1 flex grow">
				{store.loading && (
					<ProgressLinear 
						indeterminate 
						className="absolute left-0 top-0 z-10 w-full" 
					/>
				)}
				<div className="-webkit-overflow-scrolling-touch overscroll-behavior-y-none absolute left-0 top-0 h-full w-full grow overflow-y-scroll">
					<div id="basic-container">
						{store.statuses.map((status) => (
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
		</div>
	)
})

export default UrlSearchTimeline