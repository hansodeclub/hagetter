import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import React from "react"

import { Header } from "@/components/header"
import UserEntriesPage from "@/components/pages/user-entries"
import { QueryResult } from "@/features/api/types"
import { queryPosts } from "@/features/posts/actions"
import { HagetterPostInfo } from "@/features/posts/types"
import { JsonString, fromJson, toJson, toJsonObject } from "@/lib/serializer"
import head from "@/lib/utils/head"

interface PageProps {
	username: string
	posts: JsonString<QueryResult<HagetterPostInfo>>
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
	context,
) => {
	const username = head(context.query.uid)
	// check userid pattern name@domain. name and domain canbe multibyte
	if (!username || !username.match(/^[^@]+@[^@]+$/)) {
		return {
			notFound: true,
		}
	}

	const posts = await queryPosts({ username, visibility: "public,noindex" })
	if (posts.items.length === 0) {
		// 非公開ポストしかない場合にも 404 を返す
		return {
			notFound: true,
		}
	}

	return {
		props: {
			username: username,
			posts: toJson(posts),
		},
	}
}

export const UserEntries: NextPage<PageProps> = (props) => {
	const username = props.username
	const posts = fromJson<QueryResult<HagetterPostInfo>>(props.posts)
	return (
		<div>
			<Head>
				<title>{username} の投稿 - Hagetter</title>
			</Head>
			<Header />
			<UserEntriesPage username={username} posts={posts.items} />
		</div>
	)
}
export default UserEntries
