/**
 * エラー情報
 */
export interface IErrorRepository {
  postError(page: string, message: string, stack: string[]): Promise<string>
  getError(errorId: string): Promise<any>
}
