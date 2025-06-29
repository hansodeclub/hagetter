import { NextRequest, NextResponse } from "next/server"

import { createError, getError } from "@/features/error-reports/actions"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get("id")
		
		if (!id) {
			return NextResponse.json({ error: "no id" }, { status: 400 })
		}

		const doc = await getError(id)
		if (!doc) {
			return NextResponse.json(
				{ error: "Item not found" },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			...doc,
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		const data = {
			page: body.page,
			message: body.message,
			stack: body.stack,
			time: new Date().toISOString(),
		}

		const result = await createError(data)

		return NextResponse.json(result)
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}