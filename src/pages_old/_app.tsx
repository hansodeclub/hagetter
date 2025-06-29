import type { AppProps } from "next/app"
import Head from "next/head"
import React from "react"

import { ErrorNotification } from "@/components/error-notification"
import { StoreProvider, useSession } from "@/stores"
import "@/styles.css"

require("setimmediate")

export default function MyApp(props: AppProps) {
	return (
		<>
			<Head>
				<title>Hagetter</title>
				<meta property="og:site_name" content="Hagetter" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<StoreProvider>
				<MyComponent {...props} />
				<ErrorNotification />
			</StoreProvider>
		</>
	)
}

const MyComponent = ({ Component, pageProps }: AppProps) => {
	const session = useSession()
	React.useEffect(() => {
		// useEffect内はクライアントサイドで呼ばれる
		session
			.getAccount()
			.then((_account) => {})
			.catch((err) => {
				console.error(err)
			})
	}, [session])

	return <Component {...pageProps} />
}