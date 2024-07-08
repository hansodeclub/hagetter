import React from "react"

import SearchBox from "@/components/SearchBox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HagetterPostInfo } from "@/features/posts/types"
import { RecentPosts } from "./RecentPosts"

interface HomePageProps {
	recentPosts: HagetterPostInfo[]
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

// <div className="min-w-[300px] grow border border-solid border-gray-300 bg-white">

export const HomePage: React.FC<HomePageProps> = ({ recentPosts }) => {
	return (
		<div className="pt-1 md:px-4 bg-white md:bg-transparent mx-auto max-w-7xl">
			<div className="xs:dishplay-block md:flex mb-2">
				<div>
					<Card className="grow-1 w-[300px] mr-4 hidden md:block bg-white">
						<CardContent className="p-0">
							<React.Suspense fallback={""}>
								<DonmiChan />
							</React.Suspense>
						</CardContent>
					</Card>
					<SearchBox className="xs:w-full md:w-[300px] xs:px-1 md:px-0 my-2" />
				</div>
				<Card className="p-0 border-0 md:border">
					<CardHeader className="p-2">
						<CardTitle>新着まとめ</CardTitle>
					</CardHeader>
					<CardContent className="m-0 p-0">
						<RecentPosts posts={recentPosts} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default HomePage
