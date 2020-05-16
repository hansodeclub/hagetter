import { request } from './api/client'
import { InstanceInfo } from './hagetter/types'
import fetch from 'isomorphic-unfetch'
import { getUrlHost } from './api/utils'
import { Status } from './mastodon/types'
import HagetterItem, { THagetterItem } from '../stores/hagetterItem'
import { TextItem } from '../stores/editorStore'

// TODO: improvement
export const getPost = async (id: string) => {
  const result = await request(`/api/post?id=${id}`)
  return result
}

export const fetchPost = async (id: string) => {
  const result = await fetch(`/api/post?id=${encodeURIComponent(id)}`)
  return result
}

export const createPost = async (
  token: string,
  title: string,
  description: string,
  visibility: 'unlisted' | 'public',
  items: (TextItem | Status)[],
  hid?: string,
) => {
  const body = {
    title,
    description,
    visibility,
    data: items,
  } as any
  if(hid !== '') {
    body.hid = hid
  }

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }

  const res = await fetch('/api/post', options)
  if(res.status !== 200)
    throw Error((await res.json()).error.message)
  return await res.json()
}

export const getUserPosts = async (username: string, token: string) => {
  const result = await request(`/api/posts/list?user=${username}`, { token })
  return result
}

export const getList = async () => {
  const res = await request('/api/posts/list')
  return res
}

export const deletePost = async (id: string, token: string) => {
  const res = await request(`/api/post?id=${id}`, {
    token,
    method: 'DELETE',
  })
  return res
}

export const postError = async (
  page: string,
  message: string,
  stack: string[]
) => {
  const body = {
    page,
    message,
    stack,
    time: new Date(),
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }

  const result = await fetch('/api/errors', options)
  const data = await result.json()
  return data.data.id
}

export const getError = async (errorId: string) => {
  const res = await request(`/api/errors?id=${errorId}`)
  return res
}

export const getInstanceList = async (
  protocol: string,
  host: string
): Promise<any> => {
  const res = await fetch(`${protocol}//${host}/api/instances`)
  const json = await res.json()
  return { instances: json.data as string[] }
}

export const getInstanceInfo = async (name: string): Promise<InstanceInfo> => {
  const res = await request(`/api/instances?name=${encodeURIComponent(name)}`)
  return res.data as InstanceInfo
}

export const login = async (instance: string, code: string): Promise<any> => {
  const res = await fetch(`/api/login?instance=${instance}&code=${code}`)
  const json = await res.json()
  return { token: json.data.token, profile: json.data.profile } as any
}

export const fetchProfile = async (token: string) => {
  const res = await fetch('/api/mastodon/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // TODO: error handling (check error without response -> with error response)
  const data = await res.json()
  return data.data as Account
}

export const fetchTimeline = async (
  timeline: string,
  token: string,
  max_id?: string
) => {
  let url = `/api/mastodon/${timeline}`
  if (max_id) url = `${url}?max_id=${max_id}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json()
  return data.data as Status[]
}

export const fetchSearchTimeline = async (token: string, keyword: string) => {
  const res = await fetch(
    `/api/mastodon/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await res.json()
  return data.data.statuses as Status[]
}

export const fetchUrlTimeline = async (token: string, urls: string[]) => {
  const res = await fetch(`/api/mastodon/urls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ urls }),
  })

  const data = await res.json()
  return data.data.statuses as Status[]
}
