import { NextPageContext } from 'next'
import { HagetterPost } from '../../models/HagetterPost'
import { Datastore } from '@google-cloud/datastore'
import fetch from 'isomorphic-unfetch'
import { NotFound } from '~/utils/api/response'

export interface IPostRepository {
  getPost(hid: string): Promise<HagetterPost>
}

/**
 * クライアントサイドからAPI経由でポストを取得する infraに移動
 */
export class PostRepositoryClient implements IPostRepository {
  async getPost(hid: string) {
    const response = await fetch(`https://hagetter.hansode.club/api/post?id=${encodeURIComponent(hid)}`)
    const result = await response.json()
    return result.data as HagetterPost
  }
}

/**
 * サーバーサイドでポストを直接取得する infraに移動
 */
export class PostRepositoryServer implements IPostRepository {
  async getPost(hid: string): Promise<HagetterPost> {
    const datastore = new Datastore()
    const result = await datastore.get(
      datastore.key(['Hagetter', Number.parseInt(hid)])
    )

    if (result[0]) {
      const serialized = JSON.parse(JSON.stringify(result[0]))
      return { ...serialized, id: hid} as HagetterPost
    } else {
      throw new NotFound('Item not found')
    }
  }
}

/**
 * Client/SSRを自動判定する
 */
export class PostRepositoryUniversal implements IPostRepository {
  async getPost(hid: string) {
    return null as any
  }
}

export class GetPost {
  constructor(readonly postRepository: IPostRepository) {
  }

  async execute(hid: string) {
    return this.postRepository.getPost(hid)
  }
}