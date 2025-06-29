import { GetServerSideProps, NextPage } from "next"
import NextError from "next/error"
import Head from "next/head"
import React from "react"

import { Header } from "@/components/header"
import PostContent from "@/components/pages/post/post-content"
import { AnyPost } from "@/components/social/any-post"
import { getPost } from "@/features/posts/actions"
import { HagetterPost } from "@/features/posts/types"
import { sendCacheControl } from "@/lib/cdn/cloudflare"
import { JsonString, fromJson, toJson } from "@/lib/serializer"
import head from "@/lib/utils/head"

interface Props {
	code: number
	post: JsonString<HagetterPost> | null
	error: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	const hid = head(context.query.hid) as string

	try {
		const post = await getPost(hid)

		if (post?.visibility !== "draft") {
			sendCacheControl(context.res)
		}

		return {
			props: {
				code: 200,
				post: toJson(post),
				error: null,
			},
		}
	} catch (err) {
		return {
			props: {
				code: err.code ?? 500,
				post: null,
				error: err.message,
			},
		}
	}
}

export interface AnyShareButtonProps {
	title: string
}

const PostPage: NextPage<Props> = (props) => {
	const post = fromJson<HagetterPost>(props.post!)

	const { code, error } = props

	const ogp = post
		? {
				title: post.title,
				description: post.description,
				image: post.owner.avatar,
			}
		: {
				title: "エラー",
				description: "エラー",
				image: null,
			}

	return (
		<div>
			<Head>
				<title>{`${ogp.title} - Hagetter`}</title>
				<meta property="og:title" content={ogp.title} />
				<meta property="og:description" content={ogp.description} />
				{ogp.image && <meta property="og:image" content={ogp.image} />}
			</Head>
			<Header />
			<div className="flex">
				<div className="hidden sm:mt-2 sm:ml-2 sm:block">
					<AnyPost />
				</div>
				<div className="mt-2 w-full bg-white p-2 sm:m-2 sm:max-w-screen-sm sm:rounded sm:border">
					{code === 404 && <NextError statusCode={404} />}
					{code === 200 && <PostContent post={post} />}
					{code !== 200 && code !== 404 && (
						<p>エラー：{error ?? "不明なエラー"}</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default PostPage
