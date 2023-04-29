import * as React from 'react'

import { GetServerSideProps, NextPage } from 'next'

import UserEntriesPage from '@/components/pages/user-entries'

import { queryPosts } from '@/features/posts/api'
import { HagetterPostInfo } from '@/features/posts/types'
import head from '@/lib/utils/head'
import {
  JsonString,
  fromJson,
  toJson,
  toJsonObject,
} from '@/lib/utils/serializer'
import { QueryResult } from '@/types/api'

interface PageProps {
  username: string
  posts: JsonString<QueryResult<HagetterPostInfo>>
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const username = head(context.query.username)
  if (!username) {
    return {
      notFound: true,
    }
  }
  const posts = await queryPosts({ username, visibility: 'public' })
  return {
    props: {
      username: username,
      posts: toJson(posts),
    },
  }
}

export const UserEntries: NextPage<PageProps> = (props) => {
  const username = props.username
  const posts = fromJson<QueryResult<HagetterPostInfo>>(props.posts)
  return <UserEntriesPage username={username} posts={posts.items} />
}
export default UserEntries
