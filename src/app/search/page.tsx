import { Metadata } from "next"
import sanitizeHtml from "sanitize-html"

import { Header } from "@/components/header"
import { HitItem, SearchPage as SearchPageView } from "@/components/pages/search"
import { getHitString, search } from "@/features/search/algolia"

const sanitizer = (text: string): string =>
	sanitizeHtml(text, {
		allowedTags: ["em"],
	})

interface AlgoliaHit {
	objectID: string
	id: string
	title: string
	image?: string
	stars: number
	owner: string
	description: string
	visibility: string
	created_at: string
	updated_at: string
	_highlightResult: {
		title: { value: string }
		description: { value: string }
		items?: Array<{ value: string; matchLevel: string }>
	}
}

const processItem = (hit: AlgoliaHit): HitItem => {
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

type PageProps = {
	searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({
	searchParams,
}: PageProps): Promise<Metadata> {
	const { q } = await searchParams
	const keyword = q || ""
	return {
		title: keyword ? `検索結果：${keyword} - Hagetter` : "検索 - Hagetter",
	}
}

export default async function SearchPage({ searchParams }: PageProps) {
	const { q } = await searchParams
	const keyword = q || ""

	let items: HitItem[] = []
	let error: string | null = null

	if (keyword) {
		try {
			const { hits } = await search(keyword)
			items = (hits as AlgoliaHit[]).map(processItem)
		} catch (err) {
			console.warn(err)
			error = err instanceof Error ? err.message : "検索エラーが発生しました"
		}
	}

	if (error) {
		return (
			<div>
				<Header />
				<div className="p-4">エラー: {error}</div>
			</div>
		)
	}

	return (
		<div>
			<Header />
			<SearchPageView items={items} keyword={keyword} />
		</div>
	)
}
