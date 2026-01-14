import React from "react"

import { Header } from "@/components/header"
import { EntriesPage } from "@/components/pages/entries"

export const metadata = {
	title: "投稿の管理 - Hagetter",
}

export default function Page() {
	return (
		<div>
			<Header />
			<EntriesPage />
		</div>
	)
}
