import {
  InstanceInfo,
  InstanceInfoSecret,
} from '@/core/domains/instance/Instance'
import { IInstanceRepository } from '@/core/domains/instance/InstanceRepository'

import { firestore } from '@/lib/firebase/admin'
import { fromJsonObject } from '@/lib/serializer'

const instanceConverter: FirebaseFirestore.FirestoreDataConverter<InstanceInfo> =
  {
    toFirestore(instanceInfo) {
      delete instanceInfo.id
      return { ...instanceInfo }
    },
    fromFirestore(snapshot) {
      const data = snapshot.data()!
      return {
        id: snapshot.id,
        name: data.name,
        server: data.server,
        sns: data.sns,
        clientId: data.client_id,
      }
    },
  }

/**
 * サーバーサイド(FireStore)でインスタンス情報を直接取得する
 */
export class InstanceFirestoreRepository implements IInstanceRepository {
  async getInstance(name: string): Promise<InstanceInfo | null> {
    const doc = await firestore
      .collection('instances')
      .withConverter(instanceConverter)
      .doc(name)
      .get()
    return doc.data()
  }

  async getInstanceSecret(name: string): Promise<InstanceInfoSecret | null> {
    const doc = await firestore.collection('instances').doc(name).get()

    if (!doc.exists) return null
    return fromJsonObject({
      id: doc.id,
      ...doc.data(),
    })
  }

  async listInstances(): Promise<InstanceInfo[]> {
    const snapshot = await firestore
      .collection('instances')
      .withConverter(instanceConverter)
      .get()

    return snapshot.docs.map((doc) => doc.data())
  }
}
