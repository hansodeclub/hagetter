import { ValidationError } from "@/entities/errors"
import { JsonObject, fromJsonObject } from "@/lib/serializer"
import { Account, Status } from "./status"
import { VerifiableStatus, isVerifiableStatus } from "./verifiable-status"

/**
 * はげったーのポスト
 */
export type HagetterPost<StatusData = Status> = HagetterPostInfo &
	HagetterPostContent<StatusData>

export type VerifiableHagetterPost = HagetterPost<VerifiableStatus>

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

	tags?: string[]
	resouceMap?: { [key: string]: string }
}

/**
 * はげったーのポストの中身
 */
export interface HagetterPostContent<StatusData = Status> {
	contents: HagetterItem<StatusData>[]
}

/**
 * ポストの公開設定
 */
export type PostVisibility = "public" | "noindex" | "unlisted" | "draft"
export const isPostVisibility = (visibility): visibility is PostVisibility => {
	return ["public", "noindex", "unlisted", "draft"].includes(visibility)
}

export const postVisibilityLabels: {
	[key in PostVisibility]: { label: string; description: string }
} = {
	public: {
		label: "公開",
		description: "トップページの新着とユーザー投稿一覧に表示されます。",
	},
	noindex: {
		label: "未収載",
		description:
			"トップページの新着には表示されません。ユーザー投稿一覧には表示されます。",
	},
	unlisted: {
		label: "限定公開",
		description: "記事のURLを知っている人のみアクセスできます。",
	},
	draft: { label: "下書き", description: "本人以外はアクセスできません。" },
}

export type HagetterItem<StatusData = Status> =
	| StatusItem<StatusData>
	| TextItem
	| MarkdownItem
	| DividerItem
	| ReferenceItem
export type VerifiableHagetterItem = HagetterItem<VerifiableStatus>

export type ItemBase = {
	id: string
}

export interface StatusItem<StatusData = Status> extends ItemBase {
	type: "status"
	color: string
	color2?: string
	size: TextSize
	closed?: boolean
	data: StatusData
}

export type VerifiableStatusItem = StatusItem<VerifiableStatus>

export const isStatusItem = (item): item is StatusItem => {
	return item.type === "status"
}

export const isVerifiableStatusItem = (item): item is VerifiableStatusItem => {
	return item.type === "status" && isVerifiableStatus(item.data)
}

export interface TextItem extends ItemBase {
	type: "text"
	color: string
	color2?: string
	size: TextSize
	data: {
		text: string
	}
}

export const isTextItem = (item): item is TextItem => {
	return item.type === "text"
}

export interface MarkdownItem extends ItemBase {
	type: "markdown"
	data: {
		text: string
	}
}

export const isMarkdownItem = (item): item is MarkdownItem => {
	return item.type === "markdown"
}

export interface DividerItem extends ItemBase {
	type: "divider"
	color: string
}

export const isDividerItem = (item): item is DividerItem => {
	return item.type === "divider"
}

export interface ReferenceItem extends ItemBase {
	type: "divider"
	postId: string
}

export const isReferenceItem = (item): item is ReferenceItem => {
	return item.type === "divider"
}

/**
 * responsive text size
 */
export type TextSize =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "body2"
	| "inherit"

export const isTextSize = (size): size is TextSize => {
	return ["h1", "h2", "h3", "h4", "h5", "h6", "body2", "inherit"].includes(size)
}

export type Colorable = { color: string; color2?: string }
export type Sizeable = { size: TextSize }
export type Formattable = Colorable & Sizeable

export const isColorable = (item): item is Colorable => {
	return "color" in item
}

export const isSizeable = (item): item is Sizeable => {
	return "size" in item
}

export const isFormattable = (item): item is Formattable => {
	return isColorable(item) && isSizeable(item)
}

export const parseHagetterItem = (content): HagetterItem => {
	if (
		isStatusItem(content) ||
		isTextItem(content) ||
		isMarkdownItem(content) ||
		isDividerItem(content) ||
		isReferenceItem(content)
	) {
		return content
	}

	throw new ValidationError("Invalid content item")
}

export const parseVerifiableHagetterItem = (
	content,
): VerifiableHagetterItem => {
	if (
		isVerifiableStatusItem(content) ||
		isTextItem(content) ||
		isMarkdownItem(content) ||
		isDividerItem(content) ||
		isReferenceItem(content)
	) {
		return content
	}

	throw new ValidationError("Invalid content item")
}

export const parseHagetterPost = (
	obj: JsonObject<HagetterPost>,
): HagetterPost => {
	const camel: any = fromJsonObject(obj)

	return {
		...camel,
		contents: camel.contents.map(parseHagetterItem),
	}
}

export const parseVerifiableHagetterPost = (
	obj: JsonObject<HagetterPost<VerifiableStatus>>,
): HagetterPost<VerifiableStatus> => {
	const camel: any = fromJsonObject(obj)
	return {
		...camel,
		contents: camel.contents.map(parseVerifiableHagetterItem),
	}
}

export const parseHagetterPostInfo = (
	obj: JsonObject<HagetterPostInfo>,
): HagetterPostInfo => {
	return fromJsonObject<HagetterPost>(obj)
}
