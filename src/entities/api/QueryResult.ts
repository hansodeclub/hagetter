export interface QueryResult<T> {
  count: number
  cursor?: string
  items: T[]
}
