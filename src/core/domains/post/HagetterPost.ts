import { VerifiableStatus } from '@/core/domains/post/VerifiableStatus'

import { ValidationError } from '@/lib/errors'
import { JsonObject, fromJsonObject } from '@/lib/serializer'

import { Account, Status } from './Status'

export type PostVisibility = 'public' | 'unlisted' | 'draft'

/**
 * はげったーのポスト
 */
export type HagetterPost = HagetterPostInfo & HagetterPostContents

/**
 * はげったーのポスト情報
 * 一覧取得とかで使う
 */
export interface HagetterPostInfo {
  id: string
  title: string
  description: string
  image: string | null
  visibility: PostVisibility
  owner: Account

  stars: number
  createdAt: string
  updatedAt?: string
}

/**
 * はげったーのポストの中身
 */
export interface HagetterPostContents {
  contents: HagetterItem[]
}

export type HagetterItem = StatusItem<Status> | TextItem
export type VerifiableHagetterItem = StatusItem<VerifiableStatus> | TextItem

/**
 * responsive text size
 */
export type TextSize =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body2'
  | 'inherit'

export interface StatusItem<Status> {
  type: 'status'
  id: string
  color: string
  size: TextSize
  data: Status
}

export interface TextItem {
  type: 'text'
  id: string
  color: string
  size: TextSize
  data: {
    text: string
  }
}

export const isTextSize = (size: any): size is TextSize => {
  const validSize = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body2', 'inherit']
  return validSize.includes(size)
}

export const parseContentItem = (content: any): HagetterItem => {
  if (content.type === 'status') {
    if (isTextSize(content.size)) {
      return {
        ...content,
        data: content.data,
      } as StatusItem<Status>
    } else {
      throw new ValidationError(`Invalid text size: ${content.size}`)
    }
  } else if (content.type === 'text') {
    if (isTextSize(content.size)) {
      return content as TextItem
    } else {
      throw new ValidationError(`Unknown content type: ${content.type}`)
    }
  } else {
    throw new ValidationError(`Invalid text size: ${content.size}`)
  }
}

export const parseHagetterPost = (
  obj: JsonObject<HagetterPost>
): HagetterPost => {
  const camel: any = fromJsonObject(obj)
  return {
    ...camel,
    contents: camel.contents.map(parseContentItem),
  } as HagetterPost
}

export const parseHagetterPostInfo = (
  obj: JsonObject<HagetterPostInfo>
): HagetterPostInfo => {
  return fromJsonObject<HagetterPost>(obj)
}
