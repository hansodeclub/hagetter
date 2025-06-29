import { NextApiHandler } from "next"

import { respondError, withApi, withApiAuth } from "@/features/api/server"
import { queryPosts } from "@/features/posts/actions"

import head from "@/lib/utils/head"

const getMyPosts = withApiAuth(async ({ req, res, user }) => {
	const username = head(req.query.user)
	const visibility = head(req.query.visibility) ?? "public"
	if (user !== username) {
		throw Error("不正なユーザーID")
	}

	const items = await queryPosts({ username, visibility })
	return { data: items }
})

const getUserPublicPosts = withApi(async ({ req, res }) => {
	const username = head(req.query.user)
	const items = await queryPosts({ username, visibility: "public" })
	return { data: items }
})

const getPosts = withApi(async ({ req, res }) => {
	const items = await queryPosts({
		visibility: "public",
		limit: Number.parseInt(head(req.query.limit) ?? "100"),
		cursor: head(req.query.cursor),
	})

	return { data: items }
})

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method === "GET") {
			const username = head(req.query.user)
			const visibility = head(req.query.visibility) ?? "public"

			if (username && visibility !== "public") {
				await getMyPosts(req, res)
			} else if (username) {
				await getUserPublicPosts(req, res)
			} else {
				await getPosts(req, res)
			}
		} else {
			respondError(res, `Unknown method: ${req.method}`)
		}
	} catch (err) {
		console.error(err)
		respondError(res, err)
	}
}

export default handler
