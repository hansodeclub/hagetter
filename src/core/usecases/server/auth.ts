import { InstanceFirestoreRepository } from '@/core/infrastructure/server-firestore/InstanceFirestoreRepository'

import { OAuthSignIn } from '@/lib/auth/server'

export const signIn = async (
  code: string,
  instanceId: string,
  redirectUri: string
) => {
  const instanceRepository = new InstanceFirestoreRepository()
  const instanceInfo = await instanceRepository.getInstanceSecret(instanceId)
  if (!instanceInfo) {
    throw Error(`Unable to find instance: ${instanceId}`)
  }

  const { name, server, clientId, clientSecret, sns } = instanceInfo

  return OAuthSignIn(
    name,
    server,
    clientId,
    clientSecret,
    sns,
    code,
    redirectUri
  )
}
