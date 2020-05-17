// JSONでシリアライズした型を分かりやすくする
export type JsonString<T> = string

export function toJson<T>(t: T): JsonString<T> {
  return JSON.stringify(t)
}

export function fromJson<T>(t: JsonString<T>, converter?: (t: JsonString<T>) => T): T {
  return converter(t)
}