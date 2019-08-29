import { NextApiRequest, NextApiResponse } from 'next';
import { respondSuccess, respondError } from '../../utils/api/server';
import { Datastore } from '@google-cloud/datastore';
import head from '../../utils/head';

export const getData = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = head(req.query.id);
  if (!id) {
    respondError(res, 'no id');
    return;
  }

  const datastore = new Datastore();
  const result = await datastore.get(
    datastore.key(['HagetterError', Number.parseInt(id)]),
  );
  if (result[0]) {
    console.log(result);
    respondSuccess(res, {
      ...result[0],
      id,
    });
  } else {
    respondError(res, 'Item not found', 404);
  }

}

export const postData = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = {
    page: req.body.page,
    message: req.body.message,
    stack: req.body.stack,
    time: new Date()
  }

  // 記事のURL返す
  const datastore = new Datastore();
  const result = await datastore.insert({
    key: datastore.key(['HagetterError']),
    data: data
  });

  respondSuccess(res, {id: result[0].mutationResults[0].key.path[0].id});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getData(req, res);
    } else if (req.method === 'POST') {
      await postData(req, res);
    } else {
      respondError(res, `Unknown method: ${req.method}`);
    }
  } catch (err) {
    console.error(err);
    respondError(res, err);
  }
}