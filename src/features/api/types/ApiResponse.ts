/*
 Subset of Google JSON Guide
 https://google.github.io/styleguide/jsoncstyleguide.xml
*/
import { JsonObject, toJsonObject } from "@/lib/serializer"

export interface ApiResponseBase {
	apiVersion?: string
	id?: string
	method?: string
	params?: Array<{ id?: string; value: string }>
}

export type Links = { next?: string; prev?: string }

export interface ApiSuccess<T> {
	status: "ok"
	data?: T
	links?: Links
}

export interface ApiError {
	status: "error"
	error: {
		message: string
		code?: number
	}
}

export type ApiResponse<T> = ApiResponseBase & (ApiSuccess<T> | ApiError)

export const success = <T>(data?: T, links?: Links): ApiSuccess<T> => {
	if (!data) return { status: "ok" }

	return {
		status: "ok",
		data: toJsonObject<T>(data) as any,
		links: links,
	}
}

export const failure = (message: string, code?: number): ApiError => {
	if (!code)
		return {
			status: "error",
			error: { message },
		}

	return {
		status: "error",
		error: { message, code },
	}
}
