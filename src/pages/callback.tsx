import React from "react"

import fetch from "isomorphic-unfetch"
import jwt from "jsonwebtoken"
import { GetServerSideProps, NextPage } from "next"
import Cookies from "next-cookies"

import head from "@/lib/utils/head"
import { getUrlHost } from "@/lib/utils/url"

import { useSession } from "@/stores"

interface Props {
	token?: string
	error?: string
	profile?: any
}

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	try {
		const { protocol, host } = getUrlHost(context.req, undefined)
		const instance = Cookies(context).__session
		const code = head(context.query.code)

		const res = await fetch(
			`${protocol}//${host}/api/login?instance=${instance}&code=${code}`,
		)

		context.res.setHeader(
			"Set-Cookie",
			"__session=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
		)

		const json = await res.json()
		if (json.status === "error") {
			return {
				props: {
					error: json.error.message,
				},
			}
		} else {
			return { props: { token: json.data.token, profile: json.data.profile } }
		}
	} catch (error) {
		console.error(error)
		return { props: { error: error.message } }
	}
}

const Page: NextPage<Props> = ({ token, profile, error }) => {
	const session = useSession()
	//const [user, setUser] = React.useState();

	React.useEffect(() => {
		if (!token) return
		const decodedToken = jwt.decode(token)
		if (!decodedToken || typeof decodedToken !== "object") return
		const { user } = decodedToken
		session.login(user, token)
		session.setAccount(profile)
		// setUser(user);
		window.location.href = "/"
		//Router.push('/');
	}, [token])

	if (error) {
		return <p>ログインに失敗しました。({error})</p>
	}
	return <p>ログイン中...</p>
}

export default Page
