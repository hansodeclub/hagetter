import { firestore } from '@/lib/firebase/admin'

import { errorFirestoreConverter } from './utils'

export interface CreateErrorParams {
  page: string
  message?: string
  time: string
  stack: string[]
}

/**
 * サーバーサイド(FireStore)でインスタンス情報を直接取得する
 */
export const createError = async (error: CreateErrorParams) => {
  const errorRef = firestore
    .collection('errors')
    .withConverter(errorFirestoreConverter)
  const doc = await errorRef.add(error as any)
  return { id: doc.id }
}
