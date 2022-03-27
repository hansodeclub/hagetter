import { Emoji } from '~/entities/Status'

export type EmojiMap = any
export default function emojify(str: string, customEmojis?: EmojiMap): string
export function buildCustomEmojis(emojis: Emoji[]): EmojiMap
