import { camelCase, snakeCase } from 'change-case'

// JSONでシリアライズした型を分かりやすくする
// JSONに変換する際にはスネークケースに変換する
export type Snaked<T> = object
export type JsonObject<T> = Snaked<T>
export type JsonString<T> = string

export function toJson<T>(t: T): JsonString<T> {
  return JSON.stringify(toSnake(t))
}

export function toJsonObject<T>(t: T): JsonObject<T> {
  return toSnake(t)
}

export function fromJsonObject<T>(t: Snaked<T>): T {
  return fromSnake(t)
}

export function fromJson<T>(t: JsonString<T>): T {
  return fromJsonObject(JSON.parse(t))
}

export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && x.constructor === Object
}

export function transformKeys(
  data: unknown,
  transform: (key: string) => string
): unknown {
  if (Array.isArray(data)) {
    return data.map((value) => transformKeys(value, transform))
  } else if (isObject(data)) {
    const entries: [string, unknown][] = Object.entries(data).map(
      ([key, value]) => [transform(key), transformKeys(value, transform)]
    )
    const res: { [key: string]: unknown } = {}
    for (const [key, value] of entries) {
      res[key] = value
    }

    return res
  } else {
    return data
  }
}

export const toSnake = <T>(data: T): Snaked<T> => {
  return transformKeys(data, snakeCase) as Snaked<T>
}

export const fromSnake = <T>(data: Snaked<T>) => {
  return transformKeys(data, camelCase) as T
}
