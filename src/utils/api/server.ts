import { ApiError, ApiResponse, ApiSuccess } from '~/entities/api/ApiResponse'
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyAuthorization, encrypt, decrypt } from '../auth/server'
import { NotFound } from '~/entities/api/HttpResponse'
import { Masto, Status } from 'masto'
import { SecureStatus } from '~/entities/SecuredStatus'

/*
 Subset of Google JSON Guide
 https://google.github.io/styleguide/jsoncstyleguide.xml
*/

export const success = <Data>(data?: Data): ApiSuccess<Data> => {
  if (!data) return { status: 'ok', data: null }

  return {
    status: 'ok',
    data,
  }
}

export const failure = (message: string, code?: number): ApiError => {
  if (!code)
    return {
      status: 'error',
      error: { message },
    }

  return {
    status: 'error',
    error: { message, code },
  }
}

export const respondSuccess = <Data>(
  res: NextApiResponse,
  data?: Data,
  code: number = 200
) => {
  res.status(code).json(success(data))
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
        respondSuccess(res, response)
        //res.status(200).json(response);
      }
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
  masto: Masto
}

export const withApiMasto = (
  proc: (params: WithMastoParams) => Promise<any>
) => {
  return withApiAuth(async ({ req, res, user, accessToken }) => {
    const [_, server] = user.split('@')
    const masto = await Masto.login({
      uri: `https://${server}`,
      accessToken: accessToken,
    })

    return proc({ req, res, user, accessToken, masto })
  })
}

export const globalizeAcct = (status: Status, server: string): Status => {
  const account = {
    ...status.account,
    acct: status.account.acct.includes('@')
      ? status.account.acct
      : `${status.account.acct}@${server}`,
    note: '',
  }

  return {
    ...status,
    account,
  }
}

/**
 * ステータスの捏造防止のために暗号化情報を付与する
 * @param status
 */
export const secureStatus = (status: Status): SecureStatus => {
  return {
    ...status,
    secure: encrypt(JSON.stringify(status)),
  }
}

export const verifyStatus = (secureStatus: SecureStatus): Status => {
  const status = JSON.parse(decrypt(secureStatus.secure)) as Status
  if (secureStatus.id !== status.id) throw Error('Invalid Status')

  return status
}

/**
 * Mastodonからの応答ステータスを返す前に初期化する
 * @param statuses
 * @param server
 */
export const preprocessMastodonStatus = (
  statuses: Status[],
  server: string
): SecureStatus[] => {
  return statuses.map((status) => {
    const globalAcct = globalizeAcct(status, server)
    const secure = secureStatus(globalAcct)

    return secure
  })
}
