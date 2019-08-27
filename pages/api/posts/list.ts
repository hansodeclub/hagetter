import { NextApiRequest, NextApiResponse } from 'next';
import { respondSuccess, respondError } from '../../../utils/api/server';
import { Datastore } from '@google-cloud/datastore';
import head from '../../../utils/head';

const listData = async (req: NextApiRequest, res: NextApiResponse) => {
  const datastore = new Datastore();
  const query = datastore
    .createQuery('Hagetter')
    .order('created_at', {
      descending: true,
    });

  const [tasks] = await datastore.runQuery(query);
  const results = tasks.map(task => ({
    id: task[datastore.KEY].id,
    ...task
  }));

  respondSuccess(res, {
    count: results.length,
    items: results
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await listData(req, res);
    }  else {
      respondError(res, `Unknown method: ${req.method}`);
    }
  } catch (err) {
    console.error(err);
    respondError(res, err);
  }
}