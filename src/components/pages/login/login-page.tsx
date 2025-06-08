import Head from "next/head"
import React from "react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { InstanceInfo } from "@/entities/instance"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import { getHost } from "@/lib/utils/url"
import { InstanceSelector } from "./instance-selector"
export interface PageProps {
	instances: InstanceInfo[]
	error?: Error
}

export const LoginPage: React.FC<PageProps> = ({ instances, error }) => {
	const [instance, setInstance] = React.useState<InstanceInfo>()

	const handleInstanceChange = (value: InstanceInfo) => {
		setInstance(value)
	}

	const handleSubmit = (instance?: InstanceInfo) => {
		if (!instance) return
		const client = new HagetterApiClient()
		const callbackUri = `${getHost(window)}/auth/${instance.id}`
		location.href = client.getOAuthUrl(instance, callbackUri)
	}

	return (
		<div>
			<Head>
				<title>Hagetter - ログイン</title>
			</Head>
			<Header />
			<div className="container mx-auto mt-8 p-2">
				<p>ログインするインスタンスを選択してください。</p>
				<div className="mt-4 flex items-center space-x-2">
					<InstanceSelector
						instances={instances}
						onChange={handleInstanceChange}
					/>
					<Button variant="default" onClick={() => handleSubmit(instance)}>
						認証
					</Button>
				</div>
				{error && <p>{error.message}</p>}
			</div>
		</div>
	)
}

export default LoginPage
