import React from "react"

import type { QueryResult } from "features/api/types"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"

import type { SxProps, Theme } from "@mui/material/styles"

import SearchBox from "@/components/SearchBox"
import Header from "@/components/header"
import RecentPosts from "@/components/widgets/RecentPosts"

import { sendCacheControl } from "@/lib/cdn/cloudflare"
import { type JsonString, fromJson, toJson } from "@/lib/utils/serializer"

import { getRecentPublicPost } from "@/features/posts/api"
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
		const recentPosts = await getRecentPublicPost({ limit: 300 })

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

interface Props {
	recentPosts: HagetterPostInfo[]
}

const DonmiChan: React.FC = () => {
	const [logo, setLogo] = React.useState("/images/donmi_kusa_semai.png")
	React.useEffect(() => {
		if (window.location.hash === "#donmi") {
			setLogo("/images/donmi2.jpg")
		}
	}, [])

	return <img src={logo} style={{ width: "100%", display: "block" }} />
}

const Content = ({ recentPosts }: Props) => {
	return (
		<div className="pt-1 md:px-4 bg-white md:bg-transparent mx-auto max-w-7xl">
			<div className="xs:dishplay-block md:flex mb-2">
				<div>
					<div className="grow-1 w-[300px] mr-4 hidden md:block border border-solid border-gray-300 rounded bg-white">
						<React.Suspense fallback={""}>
							<DonmiChan />
						</React.Suspense>
					</div>
					<SearchBox
						sx={{
							px: { xs: 1, md: 0 },
							my: 1,
							width: { xs: "100%", md: "300px" },
						}}
					/>
				</div>
				<div className="min-w-[300px] grow border border-solid border-gray-300 bg-white">
					<RecentPosts posts={recentPosts} />
				</div>
			</div>
		</div>
	)
}

const Home: NextPage<PageProps> = (props) => {
	const recentPosts = fromJson<QueryResult<HagetterPostInfo>>(
		props.recentPosts!,
	)

	return (
		<div>
			<Head>
				<title>Hagetter</title>
			</Head>
			<Header />

			<Content recentPosts={recentPosts.items} />
		</div>
	)
}

export default Home
