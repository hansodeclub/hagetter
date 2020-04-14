import { withApiMasto } from '../../../utils/api/server'

export default withApiMasto(async ({ req, res, user, accessToken, masto }) => {
  const profile = await masto.verifyCredentials()
  const [_, instance] = user.split('@')
  if (!profile.acct.includes('@')) {
    profile.acct = `${profile.acct}@${instance}`
  }

  return profile
})
