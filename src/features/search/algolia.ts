import { serverConfig } from "@/config/server"
import { algoliasearch } from "algoliasearch"

export const getHitString = (hit: any): string | undefined => {
	const res = hit._highlightResult

	if (res.description.matchLevel !== "none") {
		return res.description.value
	}

	for (const item of res.items) {
		if (item.matchLevel !== "none") return item.value
	}

	return undefined
}

export const search = async (keyword: string, page?: number) => {
	const client = algoliasearch(
		serverConfig.algoliaAppId,
		serverConfig.algoliaApiKey,
	)

	return await client.searchSingleIndex({
		indexName: "posts",
		searchParams: { query: keyword, page },
	})
}
