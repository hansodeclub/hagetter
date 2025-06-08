import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

import { ResponsiveIndicator } from "@/components/responsive-indicator"

class MyDocument extends Document {
	render() {
		return (
			<Html lang="ja">
				<Head>
					<meta charSet="utf-8" />
					{/* PWA primary color */}
					<meta name="theme-color" content="#1976d2" />
				</Head>
				<body>
					<Main />
					<NextScript />
					<ResponsiveIndicator />
				</body>
			</Html>
		)
	}
}

export default MyDocument