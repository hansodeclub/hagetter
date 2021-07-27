import { InstanceInfo } from '~/entities/Instance'

/**
 * はげったーが対応しているマストドンインスタンス情報を取得する
 */
export interface IErrorRepository {
  postError(page: string, message: string, stack: string[]): Promise<string>
  getError(errorId: string): Promise<any>
}
