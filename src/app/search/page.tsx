"use client"

import React from "react"
import Head from "next/head"
import { useSearchParams } from "next/navigation"
import sanitizeHtml from "sanitize-html"

import { Header } from "@/components/header"
import { HitItem, SearchPage } from "@/components/pages/search"
import { getHitString, search } from "@/features/search/algolia"

const sanitizer = (text) =>
	sanitizeHtml(text, {
		allowedTags: ["em"],
	})

const processItem = (hit: any): HitItem => {
	return {
		hid: hit.objectID,
		highlightedTitle: sanitizer(hit._highlightResult.title.value),
		highlightedDescription: sanitizer(hit._highlightResult.description.value),
		highlightedContent: getHitString(hit) || "",
		post: {
			id: hit.id,
			title: hit.title,
			image: hit.image,
			stars: hit.stars,
			owner: hit.owner,
			description: hit.description,
			visibility: hit.visibility,
			createdAt: hit.created_at,
			updatedAt: hit.updated_at,
		},
	}
}

export default function Search() {
	const searchParams = useSearchParams()
	const keyword = searchParams.get("q") || ""
	
	const [items, setItems] = React.useState<HitItem[]>([])
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (!keyword) {
			setItems([])
			setLoading(false)
			return
		}

		search(keyword)
			.then(({ hits }) => {
				setItems(hits.map(processItem))
				setLoading(false)
			})
			.catch((err) => {
				console.warn(err)
				setError(err.message)
				setLoading(false)
			})
	}, [keyword])

	if (loading) {
		return (
			<div>
				<Header />
				<div className="p-4">検索中...</div>
			</div>
		)
	}

	return (
		<div>
			<Head>
				<title>検索結果：{keyword} - Hagetter</title>
			</Head>
			<Header />
			<SearchPage items={items} keyword={keyword} />
		</div>
	)
}