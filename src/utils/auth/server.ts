import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Masto } from 'masto'
//import { getInstanceInfo } from '../hagetter/server'
import { InstanceDatastoreRepository } from '~/infrastructure/InstanceDatastoreRepository'

export const encrypt = (token: string) => {
  const iv = crypto.randomBytes(16)
  const key = Buffer.from(process.env.ENCRYPT_KEY, 'hex')
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export const decrypt = (token: string) => {
  const [iv, encrypted] = token.split(':')
  const key = Buffer.from(process.env.ENCRYPT_KEY, 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  )
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export const login = async (code: string, instance: string, redirect_uri) => {
  const instanceRepository = new InstanceDatastoreRepository()
  const instanceInfo = await instanceRepository.getInstance(instance) //getInstanceInfo(instance)
  if (!instanceInfo) {
    throw Error(`Unable to find instance: ${instance}`)
  }

  const { server, client_id, client_secret, access_token } = instanceInfo
  console.log(instanceInfo)

  const masto = await Masto.login({
    uri: server,
    accessToken: access_token,
  })

  const oauthToken = await masto.fetchAccessToken({
    code,
    redirect_uri,
    client_id,
    client_secret,
    grant_type: 'authorization_code',
  })

  console.log('ouath token ok')
  const userMasto = await Masto.login({
    uri: server,
    accessToken: oauthToken.access_token,
  })

  console.log('login ok')
  const profile = await userMasto.verifyCredentials()
  profile.acct = profile.username + '@' + instance

  console.log('token ok')
  const token = generateToken(
    profile.username,
    instance,
    oauthToken.access_token
  )

  return { token, profile }
}

export const logout = async (token) => {
  const { user, accessToken } = verifyToken(token)
  const [_username, instance] = user.split('@')
  const instanceRepository = new InstanceDatastoreRepository()
  const instanceInfo = await instanceRepository.getInstance(instance)
  //const instanceInfo = await getInstanceInfo(instance)
  if (!instanceInfo) {
    throw Error(`Unable to find instance: ${instance}`)
  }

  const { client_id, client_secret, server } = instanceInfo

  const masto = await Masto.login({
    uri: server,
    accessToken: accessToken,
  })

  await masto.revokeAccessToken({
    client_id,
    client_secret,
  })
}

/**
 * generate jwt token
 * payload format is {user: username@instance, token: access token(encrypted), iat}
 * @param username
 * @param instance
 * @param access_token
 */
export const generateToken = (
  username: string,
  instance: string,
  access_token: string
): string => {
  const token = jwt.sign(
    {
      user: `${username}@${instance}`,
      token: encrypt(access_token),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
      algorithm: 'HS256',
    }
  )

  return token
}

/**
 * verify and decode jwt token
 * @param token
 */
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })

    return {
      user: decoded.user,
      accessToken: decrypt(decoded.token),
    }
  } catch (err) {
    console.error(err)
    throw Error('Failed to verify token')
  }
}

export const verifyAuthorization = (authorization: string) => {
  try {
    const [typ, token] = authorization.split(' ')
    if (typ === 'jwt' || typ === 'JWT' || typ == 'Bearer') {
      return verifyToken(token)
    }
  } catch (err) {
    console.error(err)
  }

  throw Error('Invalid Authorization Header')
}

/**
 * Sign status with server private key
 * @param acct
 * @param displayName
 * @param content
 */
/*export const signStatus = (status: any) => {
  const privKey = process.env.SIGN_PRIVKEY
  if (!privKey) {
    throw Error('Unable to read private key')
  }
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(new Buffer(JSON.stringify(status)))
  return sign.sign(privKey.replace('\\n', '\n'), 'hex') // set private key
}*/

/**
 * Check if user does not modify status
 * @param acct
 * @param displayName
 * @param content
 */
/*export const verifyStatus = (status: any): boolean => {
  const pubKey = process.env.SIGN_PUBKEY
  if (!pubKey) {
    throw Error('Unable to read public key')
  }
  const sign = crypto.createVerify('RSA-SHA256')
  sign.update(new Buffer(JSON.stringify(status)))
  return sign.verify(pubKey.replace('\\n', '\n'), 'hex') // set public key
}*/
