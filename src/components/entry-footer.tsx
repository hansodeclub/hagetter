import { PostVisibility } from "@/features/posts/types"
import React from "react"
import { Timestamp } from "./timestamp"
import { VisibilityLabel } from "./visibility-label"

export interface EntryFooterProps {
	visibility: PostVisibility
	createdAt: string
	updatedAt?: string
}

export const EntryFooter: React.FC<EntryFooterProps> = ({
	visibility,
	createdAt,
	updatedAt,
}) => {
	return (
		<footer className="flex items-center">
			<VisibilityLabel visibility={visibility} className="mr-2" />
			<div className="ml-2 text-muted-foreground text-sm">
				<Timestamp value={createdAt} className="" showSeconds={true} />
				{updatedAt && (
					<>
						<span className="">{" ("}</span>
						<Timestamp value={updatedAt} className="" showSeconds={true} />{" "}
						<span className="t">更新)</span>
					</>
				)}
			</div>
		</footer>
	)
}
