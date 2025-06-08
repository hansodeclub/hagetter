import React from "react"

import { Toot } from "@/components/toot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressLinear } from "@/components/ui/progress-linear"
import { Status } from "@/features/posts/types"
import { cn } from "@/lib/utils"
import { observer, useEditor, useTimeline } from "@/stores"
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string
	invisible?: boolean
	setInvisible?: (invisible: boolean) => void
}

const Timeline: React.FC<TimelineProps> = observer(
	({ name, invisible, className }) => {
		const store = useTimeline(name)
		const editor = useEditor()
		const itemIds = editor.itemIds
		const loadMore =
			!store.init && !store.loading ? () => store.loadMore(false) : undefined

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
			<div className={cn("flex h-full w-full flex-col", className)}>
				<div className="mx-1 mt-1">
					<Input
						placeholder="フィルタ"
						onChange={onChangeFilter}
						value={store.filter}
						className="w-full py-1"
					/>
				</div>
				<div className="relative mt-1 grow">
					{store.loading && (
						<ProgressLinear 
							indeterminate 
							className="absolute left-0 top-0 z-10 w-full" 
						/>
					)}
					<div className="-webkit-overflow-scrolling-touch overscroll-behavior-y-none absolute top-0 left-0 h-full w-full overflow-y-scroll">
						{store.filteredStatuses.map((status) => (
							<div
								key={status.id}
								className={cn("mb-2 border-gray-200 border-b pb-1", {
									"opacity-60": itemIds.has(status.id),
								})}
							>
								<Toot
									onClick={onStatusSelect}
									key={status.id}
									status={status}
									preferOriginal
								/>
							</div>
						))}
						{loadMore && (
							<div className="w-full justify-center py-[30px] text-center">
								<Button onClick={loadMore}>もっと読み込む</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		)
	},
)

export default Timeline
