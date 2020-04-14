import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuthorization } from '../auth/server';
import { NotFound } from '../api/response';

export interface WithAuhParams {
    req: NextApiRequest
    res: NextApiResponse
    user: string
    accessToken: string
}

export const withAuthorization = async (proc: (params: WithAuhParams) => Promise<any>) => {
    return (req: NextApiRequest, res: NextApiResponse) => {
        const { user, accessToken } = verifyAuthorization(req.headers.authorization);
        return proc({ req, res, user, accessToken });
    }
}

export const withApi = async <Params>(proc: (params: Params) => Promise<any>) => {
    return (req: NextApiRequest, res: NextApiResponse) => {
        try {

        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send('');
            }
        }
    }
}