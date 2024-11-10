import { CacheProvider, type EmotionCache } from "@emotion/react"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import type { AppProps } from "next/app"
import Head from "next/head"
//https://github.com/mui-org/material-ui/blob/master/examples/nextjs
import React from "react"

import { ErrorNotification } from "@/components/error-notification"
import createEmotionCache from "@/lib/createEmotionCache"
import { StoreProvider, useSession } from "@/stores"
import "@/styles.css"
import theme from "@/theme"

require("setimmediate")

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache
}

export default function MyApp(props) {
	const { emotionCache = clientSideEmotionCache } = props

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>Hagetter</title>
				<meta property="og:site_name" content="Hagetter" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<StoreProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<MyComponent {...props} />
					<ErrorNotification />
				</ThemeProvider>
			</StoreProvider>
		</CacheProvider>
	)
}

const MyComponent = ({ Component, pageProps }) => {
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
