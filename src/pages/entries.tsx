import { NextPage } from "next"
import Head from "next/head"
import React from "react"

import { Header } from "@/components/header"
import EntriesPage from "@/components/pages/entries"

export const Entries: NextPage = () => {
	return (
		<div>
			<Head>
				<title>投稿の管理 - Hagetter</title>
			</Head>
			<Header />
			<EntriesPage />
		</div>
	)
}

export default Entries
