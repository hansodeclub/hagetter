import { NextRequest, NextResponse } from "next/server"

import { transformStatus } from "@/features/api/server"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const keyword = searchParams.get("keyword")
		
		if (!keyword) {
			return NextResponse.json(
				{ error: "keyword is not specified" },
				{ status: 400 }
			)
		}

		// 認証とMastodonクライアントが必要
		const authHeader = request.headers.get("authorization")
		if (!authHeader) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// withApiMastoの代替実装が必要（簡略化）
		// const timeline = await client.search(keyword, 'statuses')
		// const [_, instance] = user.split('@')
		// return NextResponse.json({ data: transformStatus(timeline.data.statuses, instance) })
		
		// 一時的なモック実装
		return NextResponse.json({ data: [] })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}