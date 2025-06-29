import { NextRequest, NextResponse } from "next/server"

import { getPost } from "@/features/posts/actions"
import { toJsonObject } from "@/lib/serializer"

export async function GET(
	request: NextRequest,
	{ params }: { params: { hid: string } }
) {
	try {
		const id = params.hid
		if (!id) {
			return NextResponse.json(
				{ message: "ID not specified" },
				{ status: 403 }
			)
		}

		try {
			const post = await getPost(id)
			if (!post) {
				return NextResponse.json(
					{ message: "Item not found" },
					{ status: 404 }
				)
			}

			const statuses = post.contents.reduce(
				(acc, item) => (item.type === "status" ? [...acc, item.data] : acc),
				[]
			)

			return NextResponse.json(toJsonObject(statuses))
		} catch (err) {
			return NextResponse.json(
				{ message: "Item not found" },
				{ status: 404 }
			)
		}
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}