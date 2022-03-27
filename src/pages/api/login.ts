import { NextApiRequest, NextApiResponse } from 'next'

import { respondError, respondSuccess } from '~/utils/api/server'
import getHost from '~/utils/getHost'
import { login } from '~/utils/auth/server'
import head from '~/utils/head'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const instance = head(req.query.instance)
    const code = head(req.query.code)

    if (!instance || !code) {
      console.error(`Invalid parameters server=${instance}, code=${code}`)
      throw Error('Invalid parameters')
    }

    // validate access token
    const redirect_uri = `${getHost(req)}/callback`
    const { token, profile } = await login(code, instance, redirect_uri)

    return respondSuccess(res, {
      token,
      profile,
    })
  } catch (err) {
    console.error(err)
    respondError(res, err.message)
  }
}
