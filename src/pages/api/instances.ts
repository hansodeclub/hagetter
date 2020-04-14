import { NextApiRequest, NextApiResponse } from 'next';
import { respondError, respondSuccess } from '../../utils/api/server';
import head from '../../utils/head';
import { getInstanceInfo, listInstance } from '../../utils/hagetter/server';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const instanceName = head(req.query.name);

        if (!instanceName) {
            const instances = await listInstance();
            respondSuccess(res, instances);
            return;
        }

        const instanceInfo = await getInstanceInfo(instanceName);
        if (instanceInfo) {
            respondSuccess(res, {
                ...instanceInfo,
                access_token: undefined
            })
        } else {
            respondError(res, 'server not found', 404);
        }
    } catch (err) {
        respondError(res, err.message);
    }

}