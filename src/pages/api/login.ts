import { NextApiRequest, NextApiResponse } from 'next'

import { respondError, respondSuccess } from '@/lib/api/server'
import { login } from '@/lib/auth/server'
import getHost from '@/lib/getHost'
import head from '@/lib/head'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const instance = head(req.query.instance)
    const code = head(req.query.code)

    if (!instance || !code) {
      console.error(`Invalid parameters server=${instance}, code=${code}`)
      throw Error('Invalid parameters')
    }

    // validate access token
    const redirectUri = `${getHost(req)}/callback`
    const { token, profile } = await login(code, instance, redirectUri)

    return respondSuccess(res, {
      token,
      profile,
    })
  } catch (err) {
    console.error(err)
    respondError(res, err.message)
  }
}
