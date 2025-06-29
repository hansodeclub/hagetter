import { NextRequest, NextResponse } from "next/server"

import { transformStatus } from "@/features/api/server"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const max_id = searchParams.get("max_id")
		
		// 認証とMastodonクライアントが必要
		const authHeader = request.headers.get("authorization")
		if (!authHeader) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// withApiMastoの代替実装が必要（簡略化）
		// TODO: 実際のMastodonクライアント実装
		// const timeline = await client.getFavourites({ max_id })
		// const cursor = parseLinkHeader(timeline.headers.link)
		// const next = cursor?.next?.max_id
		// const prev = cursor?.prev?.min_id
		// const [_, instance] = user.split('@')
		// return NextResponse.json({
		//   data: transformStatus(timeline.data, instance),
		//   links: { prev, next }
		// })
		
		// 一時的なモック実装
		return NextResponse.json({ 
			data: [],
			links: { prev: null, next: null }
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}