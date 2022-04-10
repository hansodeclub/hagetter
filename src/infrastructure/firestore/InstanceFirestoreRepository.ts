import { IInstanceRepository } from '@/interfaces/InstanceRepository'
import { InstanceInfo } from '@/entities/Instance'
import { firestore } from '@/utils/firebase/admin'
import { fromJsonObject, Snaked } from '~/utils/serializer'

/**
 * サーバーサイド(FireStore)でインスタンス情報を直接取得する
 */
export class InstanceFirestoreRepository implements IInstanceRepository {
  async getInstance(name: string): Promise<InstanceInfo | null> {
    const doc = await firestore.collection('instances').doc(name).get()

    if (!doc.exists) return null
    return fromJsonObject({
      name: doc.id,
      ...doc.data(),
    })
  }

  async listInstances(): Promise<string[]> {
    const snapshot = await firestore.collection('instances').get()
    const result = snapshot.docs.map((doc) => doc.id)

    return result
  }
}
