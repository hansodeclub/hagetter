import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

import { respondError, respondSuccess } from "@/features/api/server"
import { createError, getError } from "@/features/error-reports/actions"
import head from "@/lib/utils/head"

export const getData = async (req: NextApiRequest, res: NextApiResponse) => {
	const id = head(req.query.id)
	if (!id) {
		respondError(res, "no id")
		return
	}

	const doc = await getError(id)
	if (!doc) {
		respondError(res, "Item not found", 404)
	}

	respondSuccess(res, {
		...doc,
	})
}

export const postData = async (req: NextApiRequest, res: NextApiResponse) => {
	const data = {
		page: req.body.page,
		message: req.body.message,
		stack: req.body.stack,
		time: new Date().toISOString(),
	}

	const result = await createError(data)

	respondSuccess(res, result)
}

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method === "GET") {
			await getData(req, res)
		} else if (req.method === "POST") {
			await postData(req, res)
		} else {
			respondError(res, `Unknown method: ${req.method}`)
		}
	} catch (err) {
		console.error(err)
		respondError(res, err)
	}
}

export default handler
