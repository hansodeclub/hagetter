export type QueryResult<T> = SuccessResult<T>

export interface SuccessResult<T> {
  count: number
  cursor?: string
  items: T[]
}

type PickByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

export const makeResult = <T>(
  items: T[],
  cursorKey: keyof PickByValueType<T, string>
): QueryResult<T> => {
  if (items.length <= 1)
    return {
      count: items.length,
      items: items,
    }

  // last item only used for checking that result has next page
  const returnItems = items.slice(0, -1)
  const cursorItem = returnItems[returnItems.length - 1]

  const cursor = cursorItem[cursorKey] as never as string // fix later

  return {
    count: returnItems.length,
    items: returnItems,
    cursor,
  }
}
