"use client"

import NextError from "next/error"
import { useParams } from "next/navigation"
import React from "react"

import { Spinner } from "@/components/spinner"
import { ErrorReport } from "@/features/error-reports/types"
import { HagetterApiClient } from "@/lib/hagetterApiClient"

export default function ErrorPage() {
	const params = useParams()
	const eid = params.eid as string
	
	const [loading, setLoading] = React.useState(true)
	const [code, setCode] = React.useState<number>()
	const [item, setItem] = React.useState<ErrorReport>()

	React.useEffect(() => {
		if (!eid) return
		
		const hagetterClient = new HagetterApiClient()
		hagetterClient.getError(eid)
			.then((report) => {
				setItem(report)
				setLoading(false)
				setCode(200)
			})
			.catch(() => {
				setLoading(false)
				setCode(404)
			})
	}, [eid])

	return (
		<div className="mx-auto max-w-4xl px-4">
			{loading && <Spinner />}
			{!loading && code === 404 && <NextError statusCode={404} />}
			{!loading && code === 200 && item && (
				<div>
					<p>{item.page}</p>
					<p>{item.time}</p>
					<div className="bg-red-50 p-2">
						StackTrace
						<br />
						{item.stack.map((line, index) => (
							<React.Fragment key={index}>
								{line}
								<br />
							</React.Fragment>
						))}
					</div>
				</div>
			)}
		</div>
	)
}