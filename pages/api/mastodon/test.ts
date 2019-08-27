import { NextApiRequest, NextApiResponse } from 'next';
import testdata from '../../../testdata.json';
import { Masto } from 'masto';
import { respondSuccess, respondError } from '../../../utils/api/server';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (process.env.NODE_ENV === 'development') {
        respondSuccess(res, testdata);
    } else {
        respondError(res, 'test API is only available in development mode');
    }
}