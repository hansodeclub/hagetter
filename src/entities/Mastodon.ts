import {
  Status as MastoStatus,
  Attachment as MastoAttachment,
  Account as MastoAccount,
  Emoji as MastoEmoji,
} from 'masto'
import { toCamel } from 'snake-camel'

// https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md

export interface Status {
  id: string
  url: string | null
  account: Account
  in_reply_to_id: string | null
  in_reply_to_account_id: string | null
  content: string
  created_at: string
  emojis: Emoji[]
  sensitive: boolean
  spoiler_text: string
  visibility: 'public' | 'unlisted' | 'private' | 'direct'
  media_attachments: Attachment[]
}

export interface Account {
  id: string
  username: string
  acct: string
  display_name: string
  avatar: string
  avatar_static: string
  header: string
  header_static: string
  emojis: Emoji[]
}

export interface Emoji {
  shortcode: string
  static_url: string
  url: string
}

export interface Attachment {
  id: string
  type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown'
  url: string
  remote_url?: string | null
  preview_url: string
  text_url?: string | null
  description?: string | null
}

export const fromMastoAccount = (account: MastoAccount): Account => {
  return {
    id: account.id,
    username: account.username,
    acct: account.acct,
    display_name: account.displayName,
    avatar: account.avatar,
    avatar_static: account.avatarStatic,
    header: account.header,
    header_static: account.headerStatic,
    emojis: account.emojis.map(fromMastoEmoji),
  }
}

export const fromMastoEmoji = (emoji: MastoEmoji): Emoji => {
  return {
    shortcode: emoji.shortcode,
    static_url: emoji.staticUrl,
    url: emoji.url,
  }
}

export const fromMastoAttachment = (
  attachment: MastoAttachment
): Attachment => {
  return {
    id: attachment.id,
    type: attachment.type,
    url: attachment.url,
    remote_url: attachment.remoteUrl,
    preview_url: attachment.previewUrl,
    text_url: attachment.textUrl,
    description: attachment.description,
  }
}

export const fromMastoStatus = (status: MastoStatus): Status => {
  return {
    id: status.id,
    media_attachments: status.mediaAttachments.map(fromMastoAttachment),
    url: status.url,
    emojis: status.emojis.map(fromMastoEmoji),
    created_at: status.createdAt,
    visibility: status.visibility,
    content: status.content,
    sensitive: status.sensitive,
    spoiler_text: status.spoilerText,
    in_reply_to_id: status.inReplyToId,
    in_reply_to_account_id: status.inReplyToAccountId,
    account: fromMastoAccount(status.account),
  }
}

export const fromObject = (object: any): Status => {
  return toCamel(object) as Status
}