import { NextRequest, NextResponse } from "next/server"

import { transformStatus } from "@/features/api/server"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const urls = body.urls

		if (!urls || !Array.isArray(urls)) {
			return NextResponse.json(
				{ error: "urls array is required" },
				{ status: 400 }
			)
		}

		// 認証とMastodonクライアントが必要
		const authHeader = request.headers.get("authorization")
		if (!authHeader) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// withApiMastoの代替実装が必要（簡略化）
		// const [_, instance] = user.split('@')
		// const ids: string[] = []
		// urls.forEach((url) => {
		//   const match = url.match(`https://${instance.replace('.', '\\.')}/.*/(\\d*)$`)
		//   if (match) {
		//     ids.push(match[1])
		//   }
		// })
		// 
		// const result: any[] = []
		// for (const id of ids) {
		//   const status = await client.getStatus(id)
		//   result.push(status.data)
		// }
		// 
		// return NextResponse.json({ data: transformStatus(result, instance) })

		// 一時的なモック実装
		return NextResponse.json({ data: [] })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}