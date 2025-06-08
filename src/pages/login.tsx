import { GetServerSideProps, NextPage } from "next"
import React from "react"

import { LoginPage } from "@/components/pages/login"
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

const Page: NextPage<PageProps> = ({ instances, error }) => {
	return <LoginPage instances={instances} error={error} />
}

export default Page
