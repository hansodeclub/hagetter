// https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md

export type { Status, Attachment } from 'masto'

export interface Account {
  id: string
  username: string
  acct: string
  display_name: string
  locked: boolean
  created_at: string // TODO: to Date
  followers_count: number
  following_count: number
  statuses_count: number
  note: string
  url: string
  avatar: string
  avatar_static: string
  header: string
  header_static: string
  emojis: Emoji[]
  moved?: Account
  fields: { name: string; value: string; verified_at: any | null }[]
  bot: boolean
}

export interface Status {
  id: string
  uri: string
  url: string | null
  account: Account
  in_reply_to_id: string | null
  in_reply_to_account_id: string | null
  reblog: Status | null
  content: string
  created_at: string // TODO: to Date
  emojis: Emoji[]
  replies_count: number
  reblogs_count: number
  favourites_count: number
  reblogged: boolean | null
  favourited: boolean | null
  muted: boolean | null
  sensitive: boolean
  spoiler_text: string
  visibility: 'public' | 'unlisted' | 'private' | 'direct'
  media_attachments: Attachment[]
  mentions: Mention[]
  tags: Tag[]
  application: Application[] | null
  language: string | null
  pinned?: string
  card: Card | null
}

export interface Application {
  name: string
  website: string | null
}

export interface Card {
  url: string
  title: string
  description: string
  image: string | null
  type: 'link' | 'photo' | 'video' | 'rich'
  author_name: string | null
  author_url: string | null
  embed_url: string | null
  provider_name: string | null
  provider_url: string | null
  html: string | null
  width: number | null
  height: number | null
}

export interface Mention {
  url: string
  username: string
  acct: string
  id: string
}

export interface Emoji {
  shortcode: string
  static_url: string
  url: string
  visible_in_picker: boolean
}

export interface Attachment {
  id: string
  type: 'image' | 'video' | 'gifv' | 'unknown'
  url: string
  remote_url?: string
  preview_url: string
  text_url?: string
  meta?: string
  description?: string
}

export interface Tag {
  name: string
  url: string
  history: string | null
}
