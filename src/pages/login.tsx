import React from "react"

import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Select from "react-select"

import { Button } from "@/components/ui/button"

import { Header } from "@/components/header"

import { HagetterApiClient } from "@/lib/hagetterApiClient"
import getHost from "@/lib/utils/url"

import { InstanceInfo } from "@/entities/instance"
import { listInstances } from "@/features/instances/actions"

interface PageProps {
	code: number
	instances: InstanceInfo[]
	error: Error | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
	ctx,
) => {
	try {
		const instances = await listInstances()

		return {
			props: { code: 200, instances, error: null },
		}
	} catch (err) {
		return {
			props: {
				code: err.code ?? 500,
				instances: [],
				error: err.message,
			},
		}
	}
}

const LoginPage: NextPage<PageProps> = ({ instances, error }) => {
	const [instance, setInstance] = React.useState<InstanceInfo>()

	const handleInstanceChange = ({ value }: { value: InstanceInfo }) => {
		setInstance(value)
	}

	const handleSubmit = (instance?: InstanceInfo) => {
		if (!instance) return
		const client = new HagetterApiClient()
		const callbackUri = `${getHost(window)}/auth/${instance.id}`
		location.href = client.getOAuthUrl(instance, callbackUri)
	}

	const selectOptions = instances.map((instance) => ({
		label: instance.name,
		value: instance,
	}))

	return (
		<div>
			<Head>
				<title>Hagetter - ログイン</title>
			</Head>
			<Header />
			<div className="container mx-auto p-2">
				<p>ログインするインスタンスを選択してください。</p>
				<div style={{ maxWidth: 500 }}>
					<Select options={selectOptions} onChange={handleInstanceChange} />
				</div>
				<Button
					variant="default"
					style={{ marginTop: 20 }}
					onClick={() => handleSubmit(instance)}
				>
					認証
				</Button>
				{error && <p>{error.message}</p>}
			</div>
		</div>
	)
}

export default LoginPage
