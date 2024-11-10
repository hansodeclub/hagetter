import { Search as SearchIcon } from "lucide-react"
import { useRouter } from "next/router"
import React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchBoxProps {
	className?: string
}

const SearchBox: React.FC<SearchBoxProps> = ({ className }) => {
	const router = useRouter()
	const inputRef = React.useRef<HTMLInputElement | null>(null)

	const onSubmit = (e) => {
		const keyword = inputRef.current?.value
		if (keyword) {
			router.push(`/search?q=${keyword}`)
		}
		e.preventDefault()
	}

	return (
		<form method="GET" onSubmit={onSubmit}>
			<div className={cn("relative", className)}>
				<SearchIcon className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
				<Input placeholder="検索" className="pl-8" ref={inputRef} />
			</div>
		</form>
	)
}

export default SearchBox
