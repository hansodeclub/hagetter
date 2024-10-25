import React from "react"

import { NextPage } from "next"

const NotFoundPage: NextPage = () => {
	return (
		<p className="flex h-full w-full items-center justify-center">
			<img src="/images/donmi404s.png" alt="Page not found" />
		</p>
	)
}

export default NotFoundPage
