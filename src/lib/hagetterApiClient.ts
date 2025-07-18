import type { QueryResult } from "features/api/types"
import fetch from "isomorphic-unfetch"
import { v4 as uuidv4 } from "uuid"

import type { InstanceInfo } from "@/entities/instance"
import type {
	HagetterItem,
	HagetterPost,
	HagetterPostInfo,
	PostVisibility,
	VerifiableHagetterPost,
} from "@/entities/post"

import type { Account, Status } from "@/entities/status"
import type { ApiResponse, Links } from "@/features/api/types/ApiResponse"
import type { ErrorReport } from "@/features/error-reports/types"
import { fromJsonObject, toJson } from "@/lib/serializer"

export interface GetPostsOptions {
	visibility?: "public" | "noindex" | "unlisted" | "draft"
	user?: string
	cursor?: string
	limit?: number
}

export type HagetterApiClientOptions = {
	baseUrl?: string
	token?: string
}

export class HagetterApiClient {
	constructor(readonly apiRoot = "/api/") {
		this.apiRoot = apiRoot.endsWith("/") ? apiRoot : `${apiRoot}/`
	}

	private _getUrl(path, query: object = {}) {
		const qs = Object.keys(query)
			.filter((key) => query[key] !== undefined && query[key] !== null)
			.map((key) => `${key}=${encodeURIComponent(query[key])}`)
			.join("&")
		const q = qs.length > 0 ? "?" : " "
		return `${this.apiRoot}${path}${q}${qs}`
	}

	private async get<T>(path, query: object = {}, asCamel = true) {
		const res = await fetch(this._getUrl(path, query))
		const data = await res.json()
		return (asCamel ? fromJsonObject(data) : data) as ApiResponse<T>
	}

	async authGet<T>(
		path: string,
		token: string,
		query: object = {},
		asCamel = true,
	) {
		const res = await fetch(this._getUrl(path, query), {
			headers: { Authorization: `Bearer ${token}` },
		})

		const data = await res.json()
		return (asCamel ? fromJsonObject(data) : data) as ApiResponse<T>
	}

	private async post<T>(path, body: object) {
		const options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		}

		const res = await fetch(this._getUrl(path), options)
		return fromJsonObject<ApiResponse<T>>(await res.json())
	}

	private async authPost<T>(path, token: string, body: object) {
		const options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: toJson(body),
		}

		const res = await fetch(this._getUrl(path), options)
		return fromJsonObject<ApiResponse<T>>(await res.json())
	}

	private async deleteAuth<T>(path, token: string, query = {}) {
		const options = {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}

		const res = await fetch(this._getUrl(path, query), options)
		return fromJsonObject<ApiResponse<T>>(await res.json())
	}

	/**
	 * APIの戻り値が成功なら値を返して、エラーならErrorをthrowする
	 */
	getData<T>(res: ApiResponse<unknown>, overrideErrorMessage?: string): T {
		if (res.status === "ok") return res.data as T
		else throw Error(overrideErrorMessage || res.error.message)
	}

	getLinks(res: ApiResponse<unknown>): Links | undefined {
		if (res.status === "ok") return res.links as Links
		else return undefined
	}

	/**
	 * ログイン処理
	 * @param instance インスタンス名
	 * @param code OAuthコールバックのcode
	 */
	/*async login(
    instance: string,
    code: string
  ): Promise<{ token: string; profile: Account }> {
    const res = await this.get('login', { instance, code })
    return {
      token: res.data.token as string,
      profile: res.data.profile as Account,
    }
  }*/

	/**
	 * 自身のアカウント情報を取得
	 */
	async getAccount(token: string): Promise<Account> {
		const res = await this.authGet<Account>("mastodon/profile", token)
		if (res.status === "ok") return res.data as Account
		else throw Error("Unable to get account")
	}

	/**
	 * ポストを取得する
	 * @param id まとめID
	 */
	async getPost(id: string): Promise<HagetterPost> {
		const res = await this.get<HagetterPost>("post", { id })
		if (res.status === "ok") return res.data as HagetterPost
		else throw Error(res.error.message)
	}

	/**
	 * ポスト一覧を取得する(publicのみ)
	 */
	async getPosts(
		options?: GetPostsOptions,
	): Promise<QueryResult<HagetterPostInfo>> {
		const res = await this.get("posts", options)
		return this.getData<QueryResult<HagetterPost>>(res)
	}

	/**
	 * 自分のポスト一覧を取得する(public/noindex/unlisted/draft含む)
	 */
	async getMyPosts(
		user: string,
		token: string,
	): Promise<QueryResult<HagetterPostInfo>> {
		const res = await this.authGet("posts", token, {
			user,
			visibility: "public,unlisted,noindex,draft",
		})
		return this.getData<QueryResult<HagetterPostInfo>>(res)
	}

	/**
	 * 署名付きポスト情報を取得する(自身のポストのみ取得可能)
	 * @param id まとめID
	 * @param token セッショントークン
	 */
	async getVerifiablePost(
		id: string,
		token: string,
	): Promise<VerifiableHagetterPost> {
		const res = await this.authGet("post", token, {
			id,
			action: "edit",
		})
		return this.getData<VerifiableHagetterPost>(res)
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
		visibility: PostVisibility,
		items: HagetterItem[],
		hid?: string,
	): Promise<string> {
		const body = {
			title,
			description,
			visibility,
			data: items,
		} as any

		if (hid !== "") {
			body.hid = hid
		}

		const res = await this.authPost("post", token, body)
		const data = this.getData<{ key: string }>(res)
		return data.key
	}

	/**
	 * ポストを削除する
	 * @param id まとめID
	 * @param token セッショントークン
	 */
	async deletePost(id: string, token: string) {
		const res = await this.deleteAuth("post", token, { id })
		return this.getData<any>(res)
	}

	/**
	 * インスタンス名一覧を取得する
	 * @param protocol
	 * @param host
	 */
	async getInstanceList(): Promise<any> {
		const res = await this.get("instances")
		const instances = this.getData<string[]>(res)
		return { instances }
	}

	/**
	 * インスタンス情報(OAuthトークン等)を取得する
	 * @param name インスタンス名
	 */
	async getInstanceInfo(name: string): Promise<InstanceInfo> {
		const res = await this.get("instances", { name })
		return this.getData<InstanceInfo>(res)
	}

	/**
	 * Get OAuth login URL
	 */
	getOAuthUrl(instanceInfo: InstanceInfo, callbackUri: string) {
		const { server, clientId, sns } = instanceInfo
		const encodedCallback = encodeURIComponent(callbackUri)
		if (sns === "misskey") {
			const session = uuidv4()
			const permission = encodeURIComponent("read:account,read:favorites")
			return `${server}/miauth/${session}/?name=Hagetter&permission=${permission}&callback=${encodedCallback}`
		}

		return `${server}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedCallback}`
	}

	/**
	 * タイムラインを取得する
	 * @param timeline タイムライン種別(home, local, public, bookmark)
	 * @param token セッショントークン
	 * @param max_id カーソル
	 */
	async getTimeline(
		timeline: string,
		token: string,
		max_id?: string,
		min_id?: string,
	) {
		const res = await this.authGet<Status[]>(
			`mastodon/${timeline}`,
			token,
			{ max_id, min_id },
			true,
		)

		return { data: this.getData<Status[]>(res), links: this.getLinks(res) }
	}

	/**
	 * タイムラインを検索
	 * @param token セッショントークン
	 * @param keyword 検索キーワード
	 */
	async getSearchTimeline(token: string, keyword: string) {
		const res = await this.authGet<Status[]>("mastodon/search", token, {
			keyword,
		})
		return this.getData(res)
	}

	/**
	 * URLでステータスを取得
	 * @param token セッショントークン
	 * @param urls ステータスのURL
	 */
	async getUrlTimeline(token: string, urls: string[]) {
		const res = await this.authPost<Status[]>("mastodon/urls", token, { urls })
		return this.getData(res)
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
		stack: string[],
	): Promise<string> {
		const body = {
			page,
			message,
			stack,
			time: new Date(),
		}

		const res = await this.post("errors", body)
		const data = this.getData<{ id: string }>(res)
		return data.id
	}

	/**
	 * システムエラー情報を取得
	 * @param errorId エラーID
	 */
	async getError(errorId: string): Promise<ErrorReport> {
		const res = await this.get("errors", {
			id: errorId,
		})

		return this.getData<ErrorReport>(res)
	}
}

// Create Default Client
export const hagetterClient = new HagetterApiClient()
