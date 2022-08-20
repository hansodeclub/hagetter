export type QueryResult<T> = SuccessResult<T>

export interface SuccessResult<T> {
  count: number
  cursor?: string
  items: T[]
}
