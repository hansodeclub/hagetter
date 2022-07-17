/*
 Subset of Google JSON Guide
 https://google.github.io/styleguide/jsoncstyleguide.xml
*/

import { JsonObject, toJsonObject } from '@/utils/serializer'

export interface ApiResponseBase {
  apiVersion?: string
  id?: string
  method?: string
  params?: Array<{ id?: string; value: string }>
}

export interface ApiSuccess<T> {
  status: 'ok' // code: 200 にしたい
  data: T
}

export interface ApiError {
  status: 'error' // code: number にしたい
  error: {
    message: string
    code?: number
  }
}

export type ApiResponse<T> = ApiResponseBase & (ApiSuccess<T> | ApiError)

export const success = <T>(data?: T): ApiSuccess<T> => {
  if (!data) return { status: 'ok', data: null }

  return {
    status: 'ok',
    data: toJsonObject<T>(data) as any,
  }
}

export const failure = (message: string, code?: number): ApiError => {
  if (!code)
    return {
      status: 'error',
      error: { message },
    }

  return {
    status: 'error',
    error: { message, code },
  }
}
