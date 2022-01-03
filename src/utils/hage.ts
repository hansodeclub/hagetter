import { InstanceInfo } from '~/entities/Instance'
import fetch from 'isomorphic-unfetch'
import { Status, Account } from '~/entities/Mastodon'
import { TextItem } from '~/stores/editorStore'
import { HagetterPost, HagetterPostInfo } from '~/entities/HagetterPost'
import { ApiResponse } from '~/entities/api/ApiResponse'
import { ErrorReport } from '~/entities/ErrorReport'
import { QueryResult } from '~/entities/api/QueryResult'

export class HagetterApiClient {
  readonly apiRoot: string

  constructor(apiRoot: string = '/api/') {
    this.apiRoot = apiRoot.endsWith('/') ? apiRoot : apiRoot + '/'
  }

  private _getUrl(path, query: object = {}) {
    const qs = Object.keys(query)
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join('&')
    const q = qs.length > 0 ? '?' : ' '
    return `${this.apiRoot}${path}${q}${qs}`
  }

  private async get<T>(path, query: object = {}) {
    const res = await fetch(this._getUrl(path, query))
    return res.json()
  }

  async getAuth(path: string, token: string, query: object = {}) {
    const res = await fetch(this._getUrl(path, query), {
      headers: { Authorization: `Bearer ${token}` },
    })

    return res.json()
  }

  private async post(path, body: object) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    const res = await fetch(this._getUrl(path), options)
    return res.json()
  }

  private async postAuth(path, token: string, body: object) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }

    const res = await fetch(this._getUrl(path), options)
    return res.json()
  }

  private async deleteAuth(path, token: string, query = {}) {
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const res = await fetch(this._getUrl(path, query), options)
    return res.json()
  }

  /**
   * ログイン処理
   * @param instance インスタンス名
   * @param code OAuthコールバックのcode
   */
  async login(
    instance: string,
    code: string
  ): Promise<{ token: string; profile: Account }> {
    const res = await this.get('login', { instance, code })
    return {
      token: res.data.token as string,
      profile: res.data.profile as Account,
    }
  }

  /**
   * 自身のアカウント情報を取得
   */
  async getAccount(token: string): Promise<Account> {
    const res = await this.getAuth('mastodon/profile', token)
    return res.data as Account
  }

  /**
   * ポストを取得する
   * @param id まとめID
   */
  async getPost(id: string): Promise<HagetterPost> {
    const result = await this.get(`post`, { id })
    return result.data as HagetterPost
  }

  /**
   * ポスト一覧を取得する(publicのみ)
   */
  async getPosts(): Promise<QueryResult<HagetterPostInfo>> {
    const result = await this.get('posts')
    return result.data as QueryResult<HagetterPostInfo>
  }

  /**
   * 自分のポスト一覧を取得する(public/unlisted含む)
   */
  async getMyPosts(
    user: string,
    token: string
  ): Promise<QueryResult<HagetterPostInfo>> {
    const result = (await this.getAuth('posts', token, {
      user,
    })) as ApiResponse<QueryResult<HagetterPostInfo>>
    if (result.status === 'ok') {
      return result.data as QueryResult<HagetterPostInfo>
    } else {
      throw Error(result.error.message)
    }
  }

  /**
   * 署名付きポスト情報を取得する(自身のポストのみ取得可能)
   * @param id まとめID
   * @param token セッショントークン
   */
  async getPostSecure(id: string, token: string): Promise<HagetterPost> {
    const result = (await this.getAuth(`post`, token, {
      id,
      action: 'edit',
    })) as ApiResponse<HagetterPost>
    if (result.status === 'ok') {
      return result.data
    } else {
      throw new Error(result.error.message)
    }
  }

  /**
   * ポストを投稿する
   * @param token
   * @param title
   * @param description
   * @param visibility
   * @param items
   * @param hid
   */
  async createPost(
    token: string,
    title: string,
    description: string,
    visibility: 'draft' | 'unlisted' | 'public',
    items: (TextItem | Status)[],
    hid?: string
  ): Promise<string> {
    const body = {
      title,
      description,
      visibility,
      data: items,
    } as any

    if (hid !== '') {
      body.hid = hid
    }

    const res = (await this.postAuth(`post`, token, body)) as ApiResponse<{
      key: string
    }>
    if (res.status === 'ok') {
      return res.data.key
    } else {
      throw Error(res.error.message)
    }
  }

  /**
   * ポストを削除する
   * @param id まとめID
   * @param token セッショントークン
   */
  async deletePost(id: string, token: string) {
    const res = await this.deleteAuth('post', token, { id })
    return res.data
  }

  /**
   * インスタンス名一覧を取得する
   * @param protocol
   * @param host
   */
  async getInstanceList(): Promise<any> {
    const res = await this.get('instances')
    return { instances: res.data as string[] }
  }

  /**
   * インスタンス情報(OAuthトークン等)を取得する
   * @param name インスタンス名
   */
  async getInstanceInfo(name: string): Promise<InstanceInfo> {
    const res = await this.get('instances', { name })
    console.log(res)
    return res.data as InstanceInfo
  }

  /**
   * タイムラインを取得する
   * @param timeline タイムライン種別(home, local, public)
   * @param token セッショントークン
   * @param max_id カーソル
   */
  async getTimeline(timeline: string, token: string, max_id?: string) {
    const query = max_id ? { max_id } : {}
    const res = await this.getAuth(`mastodon/${timeline}`, token, query)
    return res.data as Status[]
  }

  /**
   * タイムラインを検索
   * @param token セッショントークン
   * @param keyword 検索キーワード
   */
  async getSearchTimeline(token: string, keyword: string) {
    const res = await this.getAuth('mastodon/search', token, { keyword })
    return res.data.statuses as Status[]
  }

  /**
   * URLでステータスを取得
   * @param token セッショントークン
   * @param urls ステータスのURL
   */
  async getUrlTimeline(token: string, urls: string[]) {
    const res = await this.postAuth('mastodon/urls', token, { urls })
    return res.data.statuses as Status[]
  }

  /**
   * システムエラーを報告(バグってるぞ殺すぞのやつ)
   * @returns エラーID
   * @param page
   * @param message
   * @param stack
   */
  async postError(
    page: string,
    message: string,
    stack: string[]
  ): Promise<string> {
    const body = {
      page,
      message,
      stack,
      time: new Date(),
    }

    const res = await this.post('errors', body)
    return res.data.id
  }

  /**
   * システムエラー情報を取得
   * @param errorId エラーID
   */
  async getError(errorId: string): Promise<ErrorReport> {
    const res = (await this.get('errors', {
      id: errorId,
    })) as ApiResponse<ErrorReport>
    if (res.status === 'ok') {
      return res.data
    } else {
      throw Error('Error on getError')
    }
  }
}
