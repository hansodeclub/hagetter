import { GetServerSideProps, NextPage } from "next"
import React from "react"

import head from "@/lib/utils/head"

export const getServerSideProps: GetServerSideProps = async (context) => {
	/* 旧仕様のURL。
	 * /user/[username]/posts から /[username] にリダイレクトする。
	 */
	const username = head(context.query.username)
	if (!username) {
		return {
			notFound: true,
		}
	}

	return {
		redirect: {
			destination: `/${username}`,
			permanent: true,
		},
	}
}

export const UserEntries: NextPage = () => {
	return <div>moved</div>
}

export default UserEntries
