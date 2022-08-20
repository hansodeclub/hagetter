import { InstanceInfo } from '@/core/domains/instance/Instance'

/**
 * はげったーが対応しているマストドンインスタンス情報を取得する
 */
export interface IInstanceRepository {
  getInstance(name: string): Promise<InstanceInfo | null>
  listInstances(): Promise<string[]>
}
