import algoliasearch from 'algoliasearch'
import { serverConfig } from '@/config/server'

export const getHitString = (hit: any): string | undefined => {
  const res = hit._highlightResult

  if (res.description.matchLevel !== 'none') {
    return res.description.value
  }

  for (const item of res.items) {
    if (item.matchLevel !== 'none') return item.value
  }

  return undefined
}

export const search = async (keyword: string, page?: number) => {
  const client = algoliasearch(
    serverConfig.algoliaAppId,
    serverConfig.algoliaApiKey
  )
  const index = client.initIndex('posts')

  const hits = await index.search(keyword, { page })

  return hits
}
