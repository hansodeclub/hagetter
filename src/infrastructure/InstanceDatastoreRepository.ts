import { IInstanceRepository } from '~/interfaces/InstanceRepository'
import { Datastore } from '@google-cloud/datastore'
import { InstanceInfo } from '~/entities/Instance'

/**
 * サーバーサイド(DataStore)でインスタンス情報を直接取得する
 */
export class InstanceDatastoreRepository implements IInstanceRepository {
  readonly datastore: Datastore = new Datastore()

  async getInstance(name: string): Promise<InstanceInfo | null> {
    const result = await this.datastore.get(
      this.datastore.key(['Instances', name])
    )

    if (result[0]) {
      return {
        name: name,
        ...result[0],
      }
    } else {
      return null
    }
  }

  async listInstances(): Promise<string[]> {
    const query = await this.datastore.createQuery('Instances')
    const [instances] = await this.datastore.runQuery(query)
    const results = instances.map(
      (instance) => instance[this.datastore.KEY].name
    )
    return results
  }
}
