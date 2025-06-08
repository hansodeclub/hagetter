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
	cursorKey: keyof PickByValueType<T, string>,
	maxItems?: number,
): QueryResult<T> => {
	// 記事がmaxItems以下の場合は全部返す。maxItemsが指定されていない場合も全部返す
	if (!maxItems || items.length <= maxItems) {
		return {
			count: items.length,
			items: items,
		}
	}

	// 記事がmaxItemsより多い場合はmaxItems件まで返して、cursorを付ける
	const returnItems = items.slice(0, -1)
	const cursorItem = items[items.length - 1]

	const cursor = cursorItem[cursorKey] as never as string // fix later

	return {
		count: returnItems.length,
		items: returnItems,
		cursor,
	}
}
