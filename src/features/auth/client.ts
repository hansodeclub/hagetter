"use client"

import "client-only"
import cookie from "js-cookie"
import jwt from "jsonwebtoken"

import { Account } from "@/entities/status"
import { HagetterApiClient } from "@/lib/hagetter-api-client"

export const initSession = (user: string, token: string) => {
	window.localStorage.setItem("user", user)
	window.localStorage.setItem("token", token)
	window.localStorage.removeItem("profile")
}

export const clearSession = () => {
	cookie.remove("token")
	// to support logging out from all windows
	window.localStorage.setItem("logout", Date.now().toString())
	window.localStorage.removeItem("user")
	window.localStorage.removeItem("token")
	window.localStorage.removeItem("profile")
}

export const getToken = (): string | null => {
	const token = window.localStorage.getItem("token")
	if (!token) return null

	const decodedToken = jwt.decode(token)
	if (!decodedToken || typeof decodedToken === "string") return null

	const exp = decodedToken?.exp
	if (!exp) return null

	const now = new Date().getTime()
	if (exp * 1000 > now + 1000 * 60 * 60) {
		// JWTトークンの有効期限が1時間以上余っている時のみトークンを返す
		return token
	} else {
		clearSession()
		return null
	}
}

export const getAccount = async () => {
	const jwtToken = getToken()

	// Login check
	if (!jwtToken) {
		return null
	}

	const localStorageAccount = getProfile()
	if (localStorageAccount) {
		return localStorageAccount
	}

	// fetch profile via Mastodon API
	const hagetterClient = new HagetterApiClient()
	const account = await hagetterClient.getAccount(jwtToken)
	saveProfile(account)

	return account
}

export const getProfile = (): Account | null => {
	const profile = window.localStorage.getItem("profile")
	if (profile) {
		// Deal with bug in previous version
		if (profile === "undefined" || profile === "null") {
			console.warn(`profile is ${profile}`)
			window.localStorage.removeItem("profile")
			return null
		}

		return JSON.parse(profile) as Account
	}

	return null
}

export const saveProfile = (profile: Account) => {
	window.localStorage.setItem("profile", JSON.stringify(profile))
}

export const clearProfile = () => {
	window.localStorage.removeItem("profile")
}
