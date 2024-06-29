import React from "react"

import type { QueryResult } from "@/features/api/types"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"

import Header from "@/components/header"

import { sendCacheControl } from "@/lib/cdn/cloudflare"
import { type JsonString, fromJson, toJson } from "@/lib/utils/serializer"

import { HomePage } from "@/components/pages/home"
import { getRecentPublicPosts } from "@/features/posts/api"
import type { HagetterPostInfo } from "@/features/posts/types"

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
		console.log(err)
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
