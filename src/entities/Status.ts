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
  inReplyToId: string | null
  inReplyToAccountId: string | null
  content: string
  createdAt: string
  emojis: Emoji[]
  sensitive: boolean
  spoilerText: string
  visibility: 'public' | 'unlisted' | 'private' | 'direct'
  mediaAttachments: Attachment[]
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
}

export interface Emoji {
  shortcode: string
  staticUrl: string
  url: string
}

export interface Attachment {
  id: string
  type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown'
  url: string
  remoteUrl?: string | null
  previewUrl: string
  textUrl?: string | null
  description?: string | null
}

export const fromMastoAccount = (account: MastoAccount): Account => {
  return {
    id: account.id,
    username: account.username,
    acct: account.acct,
    displayName: account.displayName,
    avatar: account.avatar,
    avatarStatic: account.avatarStatic,
    header: account.header,
    headerStatic: account.headerStatic,
    emojis: account.emojis,
  }
}

export const fromMastoEmoji = (emoji: MastoEmoji): Emoji => {
  return {
    shortcode: emoji.shortcode,
    staticUrl: emoji.staticUrl,
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
    remoteUrl: attachment.remoteUrl,
    previewUrl: attachment.previewUrl,
    textUrl: attachment.textUrl,
    description: attachment.description,
  }
}

export const fromMastoStatus = (status: MastoStatus): Status => {
  return {
    id: status.id,
    mediaAttachments: status.mediaAttachments.map(fromMastoAttachment),
    url: status.url,
    emojis: status.emojis,
    createdAt: status.createdAt,
    visibility: status.visibility,
    content: status.content,
    sensitive: status.sensitive,
    spoilerText: status.spoilerText,
    inReplyToId: status.inReplyToId,
    inReplyToAccountId: status.inReplyToAccountId,
    account: fromMastoAccount(status.account),
  }
}

export const fromObject = (object: any): Status => {
  return toCamel(object) as Status
}
