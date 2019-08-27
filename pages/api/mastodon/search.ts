import { NextApiRequest, NextApiResponse } from 'next';
import { Masto } from 'masto';
import { respondSuccess, respondError } from '../../../utils/api/server';
import head from '../../../utils/head';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log('/api/mastodon/search');
        const token = req.headers.authorization;
        if (!token) {
            throw Error('Invalid credentials');
        }

        const keyword = Array.isArray(req.query.keyword) ? req.query.keyword[0] : req.query.keyword;
        if (!keyword) {
            throw Error('keyword is not specified');
        }

        const masto = await Masto.login({
            uri: process.env.MASTODON_SERVER,
            accessToken: token
        });

        const timeline = await masto.search({ q: keyword });
        for await (const statuses of timeline) {
            respondSuccess(res, statuses);
            return;
        }
    } catch (err) {
        respondError(res, err);
    }
}