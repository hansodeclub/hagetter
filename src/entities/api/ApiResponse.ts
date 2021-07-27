/*
 Subset of Google JSON Guide
 https://google.github.io/styleguide/jsoncstyleguide.xml
*/

export interface ApiResponseBase {
  apiVersion?: string
  id?: string
  method?: string
  params?: Array<{ id?: string; value: string }>
}

export interface ApiSuccess<Data> {
  status: 'ok' // code: 200 にしたい
  data: Data
}

export interface ApiError {
  status: 'error' // code: number にしたい
  error: {
    message: string
    code?: number
  }
}

export type ApiResponse<Data> = ApiResponseBase & (ApiSuccess<Data> | ApiError)
