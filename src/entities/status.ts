import { Entity } from "megalodon"
import * as parser from "node-html-parser"

// https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md

export interface Status {
	id: string
	url: string | null
	account: Account
	inReplyToId: string | null
	inReplyToAccountId: string | null
	content: string
	createdAt: string
	emojis: Emoji[]
	sensitive: boolean
	spoilerText: string
	visibility: "public" | "unlisted" | "private" | "direct"
	mediaAttachments: Attachment[]
	poll: PollResult | null
}

export interface Account {
	id: string
	username: string
	acct: string
	displayName: string
	avatar: string
	avatarStatic: string
	header: string
	headerStatic: string
	emojis: Emoji[]
	url: string
	note?: string
}

export interface Emoji {
	shortcode: string
	staticUrl: string
	url: string
}

export interface Attachment {
	id: string
	type: "image" | "video" | "gifv" | "audio" | "unknown"
	url: string
	remoteUrl?: string | null
	previewUrl: string
	textUrl?: string | null
	description?: string | null
}

export interface PollOption {
	title: string
	votesCount: number
}

export interface PollResult {
	votesCount: number
	votersCount: number
	expired: boolean
	options: PollOption[]
}

export const fromMastoPoll = (poll): PollResult => {
	return {
		votesCount: poll.votes_count,
		votersCount: poll.voters_count,
		expired: poll.expired,
		options: poll.options.map((option) => {
			return {
				title: option.title,
				votesCount: option.votes_count,
			}
		}),
	}
}

export const fromMastoAccount = (
	account: Entity.Account,
	server: string,
): Account => {
	const acct = account.acct.includes("@")
		? account.acct
		: `${account.acct}@${server}`

	return {
		id: account.id,
		username: account.username,
		acct,
		displayName: account.display_name,
		avatar: account.avatar,
		avatarStatic: account.avatar_static,
		header: account.header,
		headerStatic: account.header_static,
		emojis: account.emojis.map(fromMastoEmoji),
		url: account.url,
	}
}

export const fromMastoEmoji = (emoji: Entity.Emoji): Emoji => {
	return {
		shortcode: emoji.shortcode,
		staticUrl: emoji.static_url,
		url: emoji.url,
	}
}

export const fromMastoAttachment = (
	attachment: Entity.Attachment,
): Attachment => {
	return {
		id: attachment.id,
		type: attachment.type,
		url: attachment.url,
		remoteUrl: attachment.remote_url,
		previewUrl: attachment.preview_url,
		textUrl: attachment.text_url,
		description: attachment.description,
	}
}

const insertContentText = (content: string, text: string) => {
	const root = parser.parse(content)

	if (root.childNodes[0]?.nodeType === parser.NodeType.ELEMENT_NODE) {
		const children = root.childNodes[0].childNodes
		root.childNodes[0].childNodes = [
			new parser.TextNode(text, root.childNodes[0] as parser.HTMLElement),
			...children,
		]

		return root.toString()
	} else {
		return `${text}${content}`
	}
}

export const fromMastoStatus = (
	status: Entity.Status,
	server: string,
): Status => {
	let content = status.content
	if (status.reblog !== null && content === "") {
		const reblog = status.reblog

		content = insertContentText(
			reblog.content,
			`RT @${status.reblog.account.acct} `,
		)

		return {
			id: status.id,
			mediaAttachments: reblog.media_attachments.map(fromMastoAttachment),
			url: status.url,
			emojis: reblog.emojis.map(fromMastoEmoji),
			createdAt: status.created_at,
			visibility: status.visibility,
			content,
			sensitive: reblog.sensitive,
			spoilerText: reblog.spoiler_text,
			inReplyToId: reblog.in_reply_to_id,
			inReplyToAccountId: reblog.in_reply_to_account_id,
			account: fromMastoAccount(status.account, server),
			poll: reblog.poll ? fromMastoPoll(reblog.poll) : null,
		}
	} else {
		return {
			id: status.id,
			mediaAttachments: status.media_attachments.map(fromMastoAttachment),
			url: status.url,
			emojis: status.emojis.map(fromMastoEmoji),
			createdAt: status.created_at,
			visibility: status.visibility,
			content,
			sensitive: status.sensitive,
			spoilerText: status.spoiler_text,
			inReplyToId: status.in_reply_to_id,
			inReplyToAccountId: status.in_reply_to_account_id,
			account: fromMastoAccount(status.account, server),
			poll: status.poll ? fromMastoPoll(status.poll) : null,
		}
	}
}
