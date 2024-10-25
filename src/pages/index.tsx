import { Header } from "@/components/header"
import { HomePage } from "@/components/pages/home"
import type { QueryResult } from "@/features/api/types"
import { getRecentPublicPosts } from "@/features/posts/actions"
import type { HagetterPostInfo } from "@/features/posts/types"
import { sendCacheControl } from "@/lib/cdn/cloudflare"
import { type JsonString, fromJson, toJson } from "@/lib/serializer"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import React from "react"

interface PageProps {
	code: number
	recentPosts: JsonString<QueryResult<HagetterPostInfo>> | null
	error: string | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
	context,
) => {
	try {
		const recentPosts = await getRecentPublicPosts({ limit: 300 })

		sendCacheControl(context.res)

		return {
			props: {
				code: 200,
				recentPosts: toJson(recentPosts),
				error: null,
			},
		}
	} catch (err) {
		console.warn(err)
		return {
			props: {
				code: err.code ?? 500,
				recentPosts: null,
				error: err.message,
			},
		}
	}
}

const Home: NextPage<PageProps> = (props) => {
	const recentPosts = props.recentPosts
		? fromJson<QueryResult<HagetterPostInfo>>(props.recentPosts)
		: { items: [] }

	return (
		<div>
			<Head>
				<title>Hagetter</title>
			</Head>
			<Header />

			<HomePage recentPosts={recentPosts.items} />
		</div>
	)
}

export default Home
