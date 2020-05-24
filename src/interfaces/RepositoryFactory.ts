/**
 * リポジトリ生成のためのユーティリティクラス
 */

// PostRepository
import { IPostRepository } from '~/interfaces/PostRepository'
import { PostDatastoreRepository } from '~/infrastructure/PostDatastoreRepository'
import { PostClientRepository } from '~/infrastructure/PostClientRepository'

// InstanceRepository
import { IInstanceRepository } from './InstanceRepository'
import { InstanceDatastoreRepository } from '~/infrastructure/InstanceDatastoreRepository'

// AuthRepository

// MastodonRepository

export class PostRepositoryFactory {
  static createClient(): IPostRepository {
    return new PostClientRepository()
  }

  static createServer(): IPostRepository {
    return new PostDatastoreRepository()
  }
}

export class InstanceRepositoryFactory {
  static createServer(): IInstanceRepository {
    return new InstanceDatastoreRepository()
  }
}
