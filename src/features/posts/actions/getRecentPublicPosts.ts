import { queryPosts } from "./queryPosts"

interface GetRecentPostsOptions {
	limit?: number
	cursor?: string
}

export const getRecentPublicPosts = async ({
	limit = 300,
}: GetRecentPostsOptions) => {
	return await queryPosts({
		limit: limit,
		visibility: "public",
	})
}
