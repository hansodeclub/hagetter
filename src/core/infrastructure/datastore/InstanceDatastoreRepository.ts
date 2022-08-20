import { Datastore } from '@google-cloud/datastore'

import { InstanceInfo } from '@/core/domains/instance/Instance'
import { IInstanceRepository } from '@/core/domains/instance/InstanceRepository'

/**
 * サーバーサイド(DataStore)でインスタンス情報を直接取得する
 */
export class InstanceDatastoreRepository implements IInstanceRepository {
  readonly datastore: Datastore = new Datastore()

  async getInstance(name: string): Promise<InstanceInfo | null> {
    const [result] = await this.datastore.get(
      this.datastore.key(['Instances', name])
    )

    if (result) {
      return {
        name: name,
        ...result,
      }
    } else {
      return null
    }
  }

  async listInstances(): Promise<string[]> {
    const query = await this.datastore.createQuery('Instances')
    const [result] = await this.datastore.runQuery(query)
    if (result) {
      const instances = result.map(
        (instance) => instance[this.datastore.KEY].name
      )
      return instances
    } else {
      return []
    }
  }
}
