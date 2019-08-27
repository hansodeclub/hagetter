import { NextApiResponse } from 'next';
import { Response } from './types';

/*
 Subset of Google JSON Guide
 https://google.github.io/styleguide/jsoncstyleguide.xml
*/

export const success = <Data>(data?: Data): Response<Data> => {
    if (!data) return { status: 'ok' }

    return {
        status: 'ok',
        data
    };
}

export const failure = <Data>(message: string, code?: number): Response<Data> => {
    if (!code) return {
        status: 'error',
        error: { message }
    }

    return {
        status: 'error',
        error: { message, code }
    }
};

export const respondSuccess = <Data>(res: NextApiResponse, data?: Data, code: number = 200) => {
    res.status(code).json(success(data));
}

export const respondError = <Data>(res: NextApiResponse, message: string, code: number = 400) => {
    res.status(code).json(failure(message));
}