import { withApiMasto } from '~/utils/api/server'

export default withApiMasto(async ({ req, res, user, client }) => {
  const response = await client.verifyAccountCredentials()
  const profile = response.data

  const [_, instance] = user.split('@')
  if (!profile.acct.includes('@')) {
    profile.acct = `${profile.acct}@${instance}`
  }

  return profile
})
