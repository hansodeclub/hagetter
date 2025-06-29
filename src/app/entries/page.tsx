"use client"

import React from "react"
import Head from "next/head"

import { Header } from "@/components/header"
import EntriesPage from "@/components/pages/entries"

export default function Entries() {
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