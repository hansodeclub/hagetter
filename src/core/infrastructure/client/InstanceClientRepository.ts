import { InstanceInfo } from '@/core/domains/instance/Instance'
import { IInstanceRepository } from '@/core/domains/instance/InstanceRepository'

import { ApiHandler } from './ApiHandler'

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
