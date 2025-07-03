"use client"

import React from "react"

import { Header } from "@/components/header"
import SearchBox from "@/components/search-box"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HagetterPostInfo } from "@/features/posts/types"
import { RecentPosts } from "./recent-posts"

interface HomePageProps {
	recentPosts?: HagetterPostInfo[]
	error?: string
}

const DonmiChan: React.FC = () => {
	const [logo, setLogo] = React.useState("/images/donmi_kusa_semai.png")

	React.useEffect(() => {
		// Kawaii Mode
		if (["#uwu", "#kawaii", "#donmi"].includes(window.location.hash)) {
			setLogo("/images/donmi2.jpg")
		}
	}, [])

	return <img src={logo} style={{ width: "100%", display: "block" }} alt="" />
}

const HomePage: React.FC<HomePageProps> = ({ recentPosts = [], error }) => {
	if (error) {
		return (
			<div>
				<Header />
				<div className="p-4">{error}</div>
			</div>
		)
	}

	return (
		<div>
			<Header />
			<div className="mx-auto max-w-7xl bg-white md:bg-transparent md:px-4 md:pt-4">
				<div className="xs:dishplay-block mb-2 md:flex">
					<div>
						<Card className="mr-4 hidden w-[300px] grow-1 bg-white md:block">
							<CardContent className="p-0">
								<React.Suspense fallback={""}>
								<DonmiChan />
							</React.Suspense>
						</CardContent>
					</Card>
					<SearchBox className="my-2 w-full px-1 md:w-[300px] md:px-0" />
				</div>
				<Card className="border-0 px-1 md:border md:p-0">
					<CardHeader className="p-3">
						<CardTitle>新着まとめ</CardTitle>
					</CardHeader>
					<CardContent className="m-0 p-0">
						<RecentPosts posts={recentPosts} />
					</CardContent>
				</Card>
			</div>
		</div>
		</div>
	)
}

export { HomePage }
export default HomePage
