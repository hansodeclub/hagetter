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
	webpack: (config, { webpack, buildId, isServer }) => {
		// page routerでcdn-cache-controlを設定するために必要
		// app routerになれば不要
		config.plugins.push(
			new webpack.DefinePlugin({
				"process.env.NEXT_BUILD_ID": JSON.stringify(buildId),
			}),
		)

		return config
	} /*
	headers: async () => {
		if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ZONE)
			return []

		return [
			{
				source: "/his/:hid",
				headers: [
					{
						key: "CDN-Cache-Control",
						value: "max-age=2592000", // 30 days
					},
					{
						key: "Cache-Control",
						value: "public, max-age=0",
					},
				],
			},
		]
	},*/,
}

export default nextConfig
