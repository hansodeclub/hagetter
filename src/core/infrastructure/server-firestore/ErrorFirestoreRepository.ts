import { ErrorReport } from '@/core/domains/error/ErrorReport'
import { IInstanceRepository } from '@/core/domains/instance/InstanceRepository'

import { firestore } from '@/lib/firebase/admin'
import { Snaked, fromJsonObject, toJsonObject } from '@/lib/serializer'

/**
 * サーバーサイド(FireStore)でインスタンス情報を直接取得する
 */
export class ErrorFirestoreRepository {
  async getError(id: string): Promise<ErrorReport | null> {
    const doc = await firestore.collection('errors').doc(id).get()

    if (!doc.exists) return null
    return fromJsonObject({
      name: doc.id,
      ...doc.data(),
    })
  }

  async createError(error: ErrorReport) {
    const errorRef = firestore.collection('errors')
    const doc = await errorRef.add(toJsonObject(error))
    return { id: doc.id }
  }
}
