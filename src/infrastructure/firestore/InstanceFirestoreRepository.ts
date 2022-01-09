import { IInstanceRepository } from '~/interfaces/InstanceRepository'
import {
  InstanceInfo,
  fromObject as instanceInfoFromObject,
} from '~/entities/Instance'
import { firestore } from '~/utils/firebase/admin'

/**
 * サーバーサイド(FireStore)でインスタンス情報を直接取得する
 */
export class InstanceFirestoreRepository implements IInstanceRepository {
  async getInstance(name: string): Promise<InstanceInfo | null> {
    const doc = await firestore.collection('instances').doc(name).get()
    if (doc.exists) {
      return instanceInfoFromObject({
        name: doc.id,
        ...doc.data(),
      })
    } else {
      return null
    }
  }

  async listInstances(): Promise<string[]> {
    const snapshot = await firestore.collection('instances').get()
    const result = snapshot.docs.map((doc) => doc.id)

    return result
  }
}
