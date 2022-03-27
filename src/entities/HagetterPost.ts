import {
  Status,
  Account,
  fromObject as statusFromObject
} from './Status'

import { ValidationError, JsonObject } from '~/utils/serialized'
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
  // username: string
  // display_name: string
  //avatar: string
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

export type HagetterItem = StatusItem | TextItem

/**
 * responsive text size
 */
export type TextSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body2' | 'inherit'

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

export const parseContentItem = (content: any): HagetterItem => {
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
  hagetterPost: any
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

export const hagetterPostInfoFromObject = (
  hagetterPostInfo: any
): HagetterPostInfo => {
  return toCamel(hagetterPostInfo) as HagetterPostInfo
}
