import { NextApiRequest, NextApiResponse } from 'next';
import { Masto } from 'masto';
import { respondError } from '../../utils/api/server';
import getHost from '../../utils/getHost';
import { generateToken } from '../../utils/auth/server';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;
        if (!code) {
            throw Error('Code is not specified');
        }

        const server = 'handon.club';

        const masto = await Masto.login({
            uri: process.env.MASTODON_SERVER,
            accessToken: process.env.MY_ACCESS_TOKEN
        });

        const oauthToken = await masto.fetchAccessToken({
            code,
            redirect_uri: `${getHost(req)}/api/redirect`,
            client_id: process.env.CLIENT_KEY,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code'
        });


        const userMasto = await Masto.login({
            uri: process.env.MASTODON_SERVER,
            accessToken: oauthToken.access_token
        });

        // validate access token
        const profile = await userMasto.verifyCredentials();

        const token = generateToken(profile.username, server, oauthToken.access_token);

        res.writeHead(302, {
            'Set-Cookie': `token=${token}; Path=/`,
            'Location': `${getHost(req)}/`
        })

        res.end();

        //return respondSuccess(res, profile);

    } catch (err) {
        respondError(res, err.message);
    }
}