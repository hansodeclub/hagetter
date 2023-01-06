import generator, { MegalodonInterface } from 'megalodon'
import { NextApiRequest, NextApiResponse } from 'next'

import {
  HagetterItem,
  VerifiableHagetterItem,
} from '@/core/domains/post/HagetterPost'
import {
  Status,
  fromMastoAccount,
  fromMastoStatus,
} from '@/core/domains/post/Status'
import { VerifiableStatus } from '@/core/domains/post/VerifiableStatus'

import { ApiResponse, Links, failure, success } from '@/lib/api/ApiResponse'
import { NotFound } from '@/lib/api/HttpResponse'
import { decrypt, encrypt, verifyAuthorization } from '@/lib/auth/server'
import { fromJson, toJson } from '@/lib/serializer'

export const respondSuccess = <T>(
  res: NextApiResponse,
  data?: T,
  links?: Links,
  code: number = 200
) => {
  res.status(code).json(success(data, links))
}

export const respondError = (
  res: NextApiResponse,
  message: string,
  code: number = 400
) => {
  res.status(code).json(failure(message))
}

export interface WithApiParams {
  req: NextApiRequest
  res: NextApiResponse
}

export type WithApiProc<Params, T = {}> = (
  params: Params
) => Promise<ApiResponse<T> | void>

export const withApi = (proc: (params: WithApiParams) => Promise<any>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const response = await proc({ req, res })
      if (response) {
        respondSuccess(res, response.data, response?.links)
      }

      return response
    } catch (err) {
      if (err instanceof NotFound) {
        respondError(res, err.message, 404)
      } else {
        console.error(err)
        respondError(res, err.message, 500)
      }
    }
  }
}

export interface WithAuthParams extends WithApiParams {
  user: string
  accessToken: string
}

export const withApiAuth = (proc: (params: WithAuthParams) => Promise<any>) => {
  return withApi(async ({ req, res }) => {
    const { user, accessToken } = verifyAuthorization(req.headers.authorization)
    return proc({ req, res, user, accessToken })
  })
}

export interface WithMastoParams extends WithAuthParams {
  client: MegalodonInterface
}

export const withApiMasto = (
  proc: (params: WithMastoParams) => Promise<any>
) => {
  return withApiAuth(async ({ req, res, user, accessToken }) => {
    const [_, instance] = user.split('@')
    /*const masto = await mastoLogin({
      url: `https://${instance}`,
      accessToken: accessToken,
    })*/

    const client = generator('mastodon', `https://${instance}`, accessToken)

    return proc({ req, res, user, accessToken, client })
  })
}

export const getMyAccount = async (
  client: MegalodonInterface,
  server: string
) => {
  const res = await client.verifyAccountCredentials()
  return fromMastoAccount(res.data, server)
}

/**
 * ステータスの捏造防止のために暗号化情報を付与する(TODO: JWSに置き換え)
 * @param status
 */
export const secureStatus = (status: Status): VerifiableStatus => {
  return {
    ...status,
    secure: encrypt(toJson(status)),
  }
}

/**
 * 入力されたステータスが本物か確認する(TODO: JWSに置き換え)
 * @param secureStatus
 */
export const verifyStatus = (secureStatus: VerifiableStatus): Status => {
  const status = fromJson<Status>(decrypt(secureStatus.secure))
  if (secureStatus.id !== status.id) throw Error('Invalid Status')

  return status
}

export const verifyItems = (
  items: VerifiableHagetterItem[]
): HagetterItem[] => {
  try {
    return items.map((item) => {
      if (item.type === 'status') {
        return {
          ...item,
          data: verifyStatus(item.data),
        }
      } else return item
    })
  } catch (err) {
    console.error(err)
    throw Error('Invalid Status')
  }
}

/**
 * Mastodon APIのStatusを内部形式のStatusに変換する
 * @param statuses
 * @param server
 */
export const transformStatus = (
  statuses: Entity.Status[],
  instance: string
): VerifiableStatus[] => {
  return statuses.map((mastoStatus) => {
    const status = fromMastoStatus(mastoStatus, instance)
    return secureStatus(status)
  })
}
