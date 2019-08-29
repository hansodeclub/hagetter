import { NextApiRequest, NextApiResponse } from 'next';
import { Masto } from 'masto';
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
      datastore.key(['Hagetter', Number.parseInt(id)]),
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
    const token = req.headers.authorization;
    if (!token) {
        throw Error('Invalid credentials');
    }

    const masto = await Masto.login({
        uri: process.env.MASTODON_SERVER,
        accessToken: token
    });

    const profile = await masto.verifyCredentials();

    const data = {
        title: req.body.title,
        description: req.body.description,
        image: null,
        username: `${profile.username}@handon.club`,
        displayName: profile.display_name,
        avatar: profile.avatar,
        stars: 0,
        created_at: new Date(),
        data: req.body.data,
        user: profile,
        visibility: req.body.visibility
    }

    // 記事のURL返す
    const datastore = new Datastore();
    const result = await datastore.insert({
        key: datastore.key(['Hagetter']),
        data: data
    });

    respondSuccess(res, {key: result[0].mutationResults[0].key.path[0].id});
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