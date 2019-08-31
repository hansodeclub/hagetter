import React from 'react';
import { request, request2 } from './api/client';

// TODO: improvement
export const getPost = async (id: string) => {
  const result = await request(`/api/post?id=${id}`, false);
  return result;
};

export const getUserPost = async(username: string) => {
  const result = await request(`/api/posts/list?user=${username}`, true);
  return result;
}

export const getList = async () => {
  const res = await request('/api/posts/list', false);
  return res;
};

export const deletePost = async (id: string) => {
  const res = await request2(`/api/post?id=${id}`, {auth: true, method: 'DELETE'});
  return res;
}

export const postError = async (page: string, message: string, stack: string[]) => {
  const body = {
    page,
    message,
    stack,
    time: new Date()
  };

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };

  const result = await fetch('/api/errors', options);
  const data = await result.json();
  return data.data.id;
}

export const getError = async (errorId: string) => {
  const res = await request(`/api/errors?id=${errorId}`, false);
  return res;
};