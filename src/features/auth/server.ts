import crypto from "crypto"
import jwt from "jsonwebtoken"
import generator from "megalodon"

import { getInstance } from "@/features/instances/actions"

import { serverConfig } from "@/config/server"

export const encrypt = (token: string) => {
	const iv = crypto.randomBytes(16)
	const key = Buffer.from(serverConfig.encryptKey, "hex")
	const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
	let encrypted = cipher.update(token, "utf8", "hex")
	encrypted += cipher.final("hex")
	return `${iv.toString("hex")}:${encrypted}`
}

export const decrypt = (token: string) => {
	const [iv, encrypted] = token.split(":")
	const key = Buffer.from(serverConfig.encryptKey, "hex")
	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		key,
		Buffer.from(iv, "hex"),
	)
	let decrypted = decipher.update(encrypted, "hex", "utf8")
	decrypted += decipher.final("utf8")
	return decrypted
}

export const OAuthSignIn = async (
	instance: string,
	baseUri: string,
	clientId: string,
	clientSecret: string,
	sns: string,
	code: string,
	redirectUri: string,
) => {
	if (sns !== "mastodon" && sns !== "pleroma" && sns !== "misskey") {
		throw Error("Invalid SNS Type")
	}

	const userToken = await generator(sns, baseUri).fetchAccessToken(
		clientId,
		clientSecret,
		code,
		redirectUri,
	)

	const client = generator(sns, baseUri, userToken.accessToken)

	const profileRes = await client.verifyAccountCredentials()
	if (profileRes.status !== 200) {
		throw Error("Login Error")
	}

	const profile = profileRes.data

	profile.acct = `${profile.username}@${instance}`

	const token = generateToken(profile.username, instance, userToken.accessToken)

	return { token, profile }
}

export const logout = async (token) => {
	const { user, accessToken } = verifyToken(token)
	const [_username, instance] = user.split("@")
	const instanceInfo = await getInstance(instance)
	//const instanceInfo = await getInstanceInfo(instance)
	if (!instanceInfo) {
		throw Error(`Unable to find instance: ${instance}`)
	}

	/*
  const { clientId, clientSecret, server } = instanceInfo

  const masto = await Masto.login({
    url: server,
    accessToken: accessToken,
  })

  await masto.revokeAccessToken({
    client_id,
    client_secret,
  })*/
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
	access_token: string,
): string => {
	return jwt.sign(
		{
			user: `${username}@${instance}`,
			token: encrypt(access_token),
		},
		serverConfig.jwtSecret,
		{
			expiresIn: "24h",
			algorithm: "HS256",
		},
	)
}

/**
 * verify and decode jwt token
 * @param token
 */
export const verifyToken = (token: string) => {
	try {
		const decoded = jwt.verify(token, serverConfig.jwtSecret, {
			algorithms: ["HS256"],
		})

		if (!decoded || typeof decoded !== "object") {
			throw Error("Invalid token")
		}

		return {
			user: decoded.user,
			accessToken: decrypt(decoded.token),
		}
	} catch (err) {
		console.error(err)
		throw Error("Failed to verify token")
	}
}

export const verifyAuthorization = (authorization: string) => {
	try {
		const [typ, token] = authorization.split(" ")
		if (typ === "jwt" || typ === "JWT" || typ === "Bearer") {
			return verifyToken(token)
		}
	} catch (err) {
		console.error(err)
	}

	throw Error("Invalid Authorization Header")
}
