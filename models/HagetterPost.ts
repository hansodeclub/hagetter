export type PostVisibility = 'public' | 'unlisted' | 'draft'

/**
 * はげったーのポスト
 */
export type HagetterPost = HagetterPostInfo & HagetterPostData

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
  displayName: string
  avatar: string
  visibility: PostVisibility

  stars: number
  created_at: string
  updated_at?: string
}

/**
 * はげったーのポストの中身
 */
export interface HagetterPostData {
  data: any[]
  user: any
}

