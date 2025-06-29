import type { Metadata } from "next"
import React from "react"

import { ErrorNotification } from "@/components/error-notification"
import { ResponsiveIndicator } from "@/components/responsive-indicator"
import { StoreProvider } from "@/stores"
import "@/styles.css"
import { ClientSessionProvider } from "./client-session-provider"

require("setimmediate")

export const metadata: Metadata = {
	title: "Hagetter",
	other: {
		"og:site_name": "Hagetter",
	},
	viewport: "minimum-scale=1, initial-scale=1, width=device-width",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="theme-color" content="#1976d2" />
			</head>
			<body>
				<StoreProvider>
					<ClientSessionProvider>
						{children}
						<ErrorNotification />
					</ClientSessionProvider>
				</StoreProvider>
				<ResponsiveIndicator />
			</body>
		</html>
	)
}