import { NextApiRequest, NextApiResponse } from 'next';
import { Masto } from 'masto';
import { respondSuccess, respondError } from '../../../utils/api/server';
import { Datastore } from '@google-cloud/datastore';
import head from '../../../utils/head';

const getUserPosts = async (username: string, req: NextApiRequest, res: NextApiResponse) => {
  const datastore = new Datastore();
  const token = req.headers.authorization;
  if (!token) {
    throw Error('Invalid credentials');
  }

  const masto = await Masto.login({
    uri: process.env.MASTODON_SERVER,
    accessToken: token
  });

  const profile = await masto.verifyCredentials();
  if(profile.username+'@handon.club' !== username) {
    respondError(res, '不正なユーザーID');
    return;
  }

  const query = datastore
    .createQuery('Hagetter')
    .filter('username', '=', username)
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

const listData = async (req: NextApiRequest, res: NextApiResponse) => {
  const username=head(req.query.user);
  if(username) {
    return getUserPosts(username,req, res);
  }

  const datastore = new Datastore();

   const query = datastore
      .createQuery('Hagetter')
      .filter('visibility', '=', 'public')
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