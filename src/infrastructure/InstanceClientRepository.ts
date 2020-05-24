import { IInstanceRepository } from '~/interfaces/InstanceRepository'
import { Datastore } from '@google-cloud/datastore'
import { InstanceInfo } from '~/entities/Instance'
import { ApiHandler } from './handler/ApiHandler'

/**
 * サーバーサイド(DataStore)でインスタンス情報を直接取得する
 */
export class InstanceClientRepository implements IInstanceRepository {
  constructor(readonly apiHandler: ApiHandler) {}

  async getInstance(name: string): Promise<InstanceInfo | null> {
    return null
  }

  async listInstances(): Promise<string[]> {
    return []
  }
}
