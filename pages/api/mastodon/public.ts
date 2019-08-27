import { NextApiRequest, NextApiResponse } from 'next';
import { Masto } from 'masto';
import { respondSuccess, respondError } from '../../../utils/api/server';
import head from '../../../utils/head';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log('/api/mastodon/public');
        const token = req.headers.authorization;
        if (!token) {
            throw Error('Invalid credentials');
        }

        const masto = await Masto.login({
            uri: process.env.MASTODON_SERVER,
            accessToken: token
        });

        const timeline = await masto.fetchPublicTimeline({ max_id: head(req.query.max_id) });
        for await (const statuses of timeline) {
            respondSuccess(res, statuses);
            return;
        }
    } catch (err) {
        respondError(res, err);
    }
}