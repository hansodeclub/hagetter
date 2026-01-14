import jwt from "jsonwebtoken"
import generator from "megalodon"

import { serverConfig } from "@/config/server"

import { decrypt, encrypt } from "@/lib/crypto"

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
	accessToken: string,
): string => {
	if (username.includes("@") || instance.includes("@")) {
		throw Error("Invalid username or instance")
	}

	return jwt.sign(
		{
			user: `${username}@${instance}`,
			token: encrypt(accessToken, serverConfig.encryptKey),
		},
		serverConfig.jwtSecret,
		{
			expiresIn: "24h",
			algorithm: "HS256",
		},
	)
}

export interface TokenPayload {
	user: string
	accessToken: string
}

/**
 * verify and decode jwt token
 * @param token
 */
export const verifyToken = (token: string): TokenPayload => {
	try {
		const decoded = jwt.verify(token, serverConfig.jwtSecret, {
			algorithms: ["HS256"],
		})

		if (!decoded || typeof decoded !== "object") {
			throw Error("Invalid token")
		}

		return {
			user: decoded.user,
			accessToken: decrypt(decoded.token, serverConfig.encryptKey),
		}
	} catch (err) {
		console.error(err)
		throw Error("Failed to verify token")
	}
}

export const verifyAuthorization = (authorization: string): TokenPayload => {
	try {
		const [typ, token] = authorization.split(" ")
		if (typ === "jwt" || typ === "JWT" || typ === "Bearer") {
			return verifyToken(token)
		}

		throw Error("Invalid Authorization Header")
	} catch (err) {
		console.error(err)
		throw Error("Failed to verify token")
	}
}
