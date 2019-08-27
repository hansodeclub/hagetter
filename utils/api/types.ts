import { NextApiResponse } from 'next';

/*
 Subset of Google JSON Guide
 https://google.github.io/styleguide/jsoncstyleguide.xml
*/

export interface ErrorInfo {
  message: string
  code?: number
};

export interface Response<Data> {
  status: 'ok' | 'error' // user friendly
  apiVersion?: string
  id?: string
  method?: string
  params?: Array<{ id?: string, value: string }>
  data?: Data
  error?: ErrorInfo
};