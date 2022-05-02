import { NextApiRequest, NextApiResponse } from 'next'
import { respondSuccess, respondError } from '@/utils/api/server'
import head from '@/utils/head'
import { ErrorFirestoreRepository } from '@/infrastructure/firestore/ErrorFirestoreRepository'

export const getData = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = head(req.query.id)
  if (!id) {
    respondError(res, 'no id')
    return
  }

  const errorRepository = new ErrorFirestoreRepository()
  const doc = await errorRepository.getError(id)
  if (!doc) {
    respondError(res, 'Item not found', 404)
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

  const errorRepository = new ErrorFirestoreRepository()
  const result = await errorRepository.createError(data)

  respondSuccess(res, result)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getData(req, res)
    } else if (req.method === 'POST') {
      await postData(req, res)
    } else {
      respondError(res, `Unknown method: ${req.method}`)
    }
  } catch (err) {
    console.error(err)
    respondError(res, err)
  }
}
