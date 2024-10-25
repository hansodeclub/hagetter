import React from "react"

import { Roboto_Condensed } from "next/font/google"
import Link from "next/link"

const robotoCondensedBold = Roboto_Condensed({
	weight: "900",
	subsets: ["latin"],
})

const Logo: React.FC = () => {
	return (
		<Link
			href="/"
			style={{
				fontSize: 24,
				fontWeight: 900,
			}}
			className={robotoCondensedBold.className}
		>
			Hagetter
		</Link>
	)
}

export default Logo
