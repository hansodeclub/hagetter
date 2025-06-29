import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		// 認証とMastodonクライアントが必要
		const authHeader = request.headers.get("authorization")
		if (!authHeader) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// withApiMastoの代替実装が必要（簡略化）
		// TODO: 実際のMastodonクライアント実装
		// const response = await client.verifyAccountCredentials()
		// const profile = response.data
		// const [_, instance] = user.split('@')
		// if (!profile.acct.includes('@')) {
		//   profile.acct = `${profile.acct}@${instance}`
		// }
		// return NextResponse.json({ data: profile })
		
		// 一時的なモック実装
		return NextResponse.json({ 
			data: {
				id: "mock_user_id",
				username: "mock_user",
				acct: "mock_user@example.com",
				display_name: "Mock User",
				avatar: "",
				followers_count: 0,
				following_count: 0,
				statuses_count: 0
			}
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}