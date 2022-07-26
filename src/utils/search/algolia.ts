import algoliasearch from 'algoliasearch'

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
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  )
  const index = client.initIndex('posts')

  const hits = await index.search(keyword, { page })

  return hits
}
