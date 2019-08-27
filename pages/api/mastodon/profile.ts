import { NextApiRequest, NextApiResponse } from 'next';
import { Masto } from 'masto';
import { respondSuccess, respondError } from '../../../utils/api/server';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log('/api/mastodon/profile');
        const token = req.headers.authorization;
        if (!token) {
            throw Error('Invalid credentials');
        }

        const masto = await Masto.login({
            uri: process.env.MASTODON_SERVER,
            accessToken: token
        });

        const profile = await masto.verifyCredentials();
        respondSuccess(res, profile);
    } catch (err) {
        console.log(err);
        respondError(res, err);
    }
}