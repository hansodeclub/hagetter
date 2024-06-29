import React from "react"

import SearchBox from "@/components/SearchBox"
import RecentPosts from "@/components/widgets/RecentPosts"
import type { HagetterPostInfo } from "@/features/posts/types"

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

export const HomePage: React.FC<HomePageProps> = ({ recentPosts }) => {
	return (
		<div className="pt-1 md:px-4 bg-white md:bg-transparent mx-auto max-w-7xl">
			<div className="xs:dishplay-block md:flex mb-2">
				<div>
					<div className="grow-1 w-[300px] mr-4 hidden md:block border border-solid border-gray-300 rounded bg-white">
						<React.Suspense fallback={""}>
							<DonmiChan />
						</React.Suspense>
					</div>
					<SearchBox className="xs:w-full md:w-[300px] xs:px-1 md:px-0 my-2" />
				</div>
				<div className="min-w-[300px] grow border border-solid border-gray-300 bg-white">
					<RecentPosts posts={recentPosts} />
				</div>
			</div>
		</div>
	)
}

export default HomePage
