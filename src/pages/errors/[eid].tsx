import NextError from "next/error"
import { useRouter } from "next/router"
import React from "react"

import { Spinner } from "@/components/spinner"
import { ErrorReport } from "@/features/error-reports/types"
import { HagetterApiClient } from "@/lib/hagetterApiClient"
import head from "@/lib/utils/head"

const Post = () => {
	const router = useRouter()
	const eid = head(router.query.eid)
	const [loading, setLoading] = React.useState(true)
	const [code, setCode] = React.useState<number>()
	const [item, setItem] = React.useState<ErrorReport>()

	React.useEffect(() => {
		let unmounted = false
		if (!eid) return
		const hagetterClient = new HagetterApiClient()
		hagetterClient.getError(eid).then((report) => {
			setItem(report)
			setLoading(false)
			setCode(200)
		})

		return () => {
			unmounted = true
		}
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
						{item.stack.map((line) => (
							<>
								{line}
								<br />
							</>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default Post
