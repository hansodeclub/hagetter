import React from "react"

import { Header } from "@/components/header"
import { HitItem, SearchPage } from "@/components/pages/search"
import { getHitString, search } from "@/features/search/algolia"
import { JsonString, fromJson, toJson } from "@/lib/serializer"
import head from "@/lib/utils/head"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import sanitizeHtml from "sanitize-html"

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

interface PageProps {
	keyword: string
	items: JsonString<HitItem[]>
	hits: number
	page: number | null
	pages: number | null
	error: string | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
	context,
) => {
	try {
		const keyword = head(context.query.q)

		if (!keyword) {
			return {
				props: {
					keyword: "",
					items: toJson([]),
					hits: 0,
					page: null,
					pages: null,
					error: null,
				},
			}
		}

		const { hits, nbHits, page, nbPages } = await search(keyword)

		return {
			props: {
				keyword,
				items: toJson(hits.map(processItem)),
				hits: nbHits,
				page: page,
				pages: nbPages,
				error: null,
			},
		}
	} catch (err) {
		console.warn(err)
		return {
			props: {
				keyword: "",
				hits: 0,
				items: toJson([]),
				page: null,
				pages: null,
				error: err.message,
			},
		}
	}
}

const Search: NextPage<PageProps> = (props) => {
	const items: HitItem[] = fromJson(props.items)

	return (
		<div>
			<Head>
				<title>検索結果：{props.keyword} - Hagetter</title>
			</Head>
			<Header />
			<SearchPage items={items} keyword={props.keyword} />
		</div>
	)
}

export default Search
