// JSONでシリアライズした型を分かりやすくする
export type JsonString<T> = string

export function toJson<T>(t: T): JsonString<T> {
  return JSON.stringify(t)
}

export function fromJson<T>(
  t: JsonString<T>,
  converter?: (t: JsonString<T>) => T
): T {
  return converter(t)
}

// 型のフィールド名一覧を取得
export function getFieldNames(converter: { typeMap: any }, ref: string) {
  const typeMap = converter.typeMap
  return typeMap[ref].props.map((field) => field.js)
}
