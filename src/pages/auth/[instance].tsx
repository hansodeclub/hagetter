import React from "react"

import jwt from "jsonwebtoken"
import { GetServerSideProps, NextPage } from "next"

import head from "@/lib/utils/head"
import { getHost, getUrlHost } from "@/lib/utils/url"

import { signIn } from "@/features/auth/auth"
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
		const instance = head(context.query.instance)
		const code = head(context.query.code)

		if (!instance || !code) throw Error("Invalid request")

		const redirectUri = `${getHost(context.req)}/auth/${instance}`
		const { token, profile } = await signIn(code, instance, redirectUri)
		return { props: { token, profile } }
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
