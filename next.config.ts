import { NextConfig } from "next"

require("dotenv").config()

const nextConfig: NextConfig = {
	poweredByHeader: false,
	output: "standalone",
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	// App Router用のカスタムキャッシュハンドラー（一時的に無効）
	// cacheHandler: require.resolve("./cache-handler.js"),
	// App Routerでのキャッシュ設定
	headers: async () => {
		if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ZONE)
			return []

		return [
			{
				source: "/hi/:hid",
				headers: [
					{
						key: "CDN-Cache-Control",
						value: "max-age=15552000", // 6 months
					},
					{
						key: "Cache-Control",
						value: "public, max-age=0", // No cache
					},
				],
			},
			{
				source: "/",
				headers: [
					{
						key: "CDN-Cache-Control",
						value: "max-age=15552000", // 6 months
					},
					{
						key: "Cache-Control",
						value: "public, max-age=0", // No cache
					},
				],
			},
		]
	},
}

export default nextConfig
