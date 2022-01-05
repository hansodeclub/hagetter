import {
  Status,
  toObject as statusToObject,
  fromObject as statusFromObject,
} from './Status'

import { ValidationError } from '~/utils/parser'
import { JsonObject } from '~/utils/serialized'
import { toCamel, toSnake } from 'snake-camel'

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
  username: string
  display_name: string
  avatar: string
  visibility: PostVisibility

  stars: number
  created_at: string
  updated_at?: string
}

/**
 * はげったーのポストの中身
 */
export interface HagetterPostContents {
  contents: ContentItemType[]
}

type ContentItemType = StatusItem | TextItem

/**
 * responsive text size
 */
type TextSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body2' | 'inherit'

export interface StatusItem {
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

export const parseContentItem = (content: any): ContentItemType => {
  if (content.type === 'status') {
    if (isTextSize(content.size)) {
      return {
        ...content,
        data: statusFromObject(content.data),
      } as StatusItem
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

export const fromObject = (
  hagetterPost: JsonObject<HagetterPost>
): HagetterPost => {
  const camel: any = toCamel(hagetterPost)
  return {
    ...camel,
    contents: camel.contents.map(parseContentItem),
  } as HagetterPost
}

export const toObject = (
  hagetterPost: HagetterPost
): JsonObject<HagetterPost> => {
  return toSnake(hagetterPost)
}
