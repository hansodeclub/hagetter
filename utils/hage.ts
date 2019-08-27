import { request } from './api/client';

// TODO: improvement
export const getPost = async (id: string) => {
  const result = await request(`/api/post?id=${id}`, false);
  return result;
};

export const getList = async () => {
  const res = await request('/api/posts/list', false);
  return res;
};
