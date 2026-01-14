import { NextResponse } from 'next/server'
import {
	ApiSuccess,
	Links,
	failure,
	success,
	ApiError,
} from "@/features/rest-api/types"

// App Router用のレスポンス関数
export const successResponse = <T>(
	data?: T,
	links?: Links,
	code = 200,
	headers: Record<string, string> = {},
): NextResponse<ApiSuccess<T>> => {
	return NextResponse.json(success(data, links), {
		status: code,
		headers: {
			...headers,
		},
	})
}

export const errorResponse = (
	message: string,
	code = 400,
	headers: Record<string, string> = {},
): NextResponse<ApiError> => {
	return NextResponse.json(failure(message), {
		status: code,
		headers: {
			...headers,
		},
	})
}