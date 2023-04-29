import * as React from 'react'

import { GetServerSideProps, NextPage } from 'next'
import NextError from 'next/error'
import Head from 'next/head'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { SxProps, Theme } from '@mui/material/styles'

import AnyShare from '@/components/AnyShare'
import Header from '@/components/header'
import PostContent from '@/components/post/PostContent'

import { getPost } from '@/features/posts/api'
import { HagetterPost } from '@/features/posts/types'
import { sendCacheControl } from '@/lib/cdn/cloudflare'
import head from '@/lib/utils/head'
import { JsonString, fromJson, toJson } from '@/lib/utils/serializer'

const styles: { [key: string]: SxProps<Theme> } = {
  container: (theme) => ({
    [theme.breakpoints.down('sm')]: {
      padding: '20px 5px',
      width: '100%',
      backgroundColor: '#fff',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 600,
      margin: 1,
      marginLeft: 0,
      //border: theme.app.border,
      boxShadow: 1,
      borderRadius: 1,
      padding: '10px 5px',
      backgroundColor: '#fff',
    },
  }),
  shareButtons: (theme) => ({
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      margin: 2,
      marginTop: 10,
      display: 'block',
    },
  }),
}

interface Props {
  code: number
  post: JsonString<HagetterPost> | null
  error: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const hid: string = head(context.query.hid)

  try {
    const post = await getPost(hid)

    sendCacheControl(context.res)

    return {
      props: {
        code: 200,
        post: toJson(post),
        error: null,
      },
    }
  } catch (err) {
    return {
      props: {
        code: err.code ?? 500,
        post: null,
        error: err.message,
      },
    }
  }
}

export interface AnyShareButtonProps {
  title: string
}

const PostPage: NextPage<Props> = (props) => {
  const post = fromJson<HagetterPost>(props.post)

  const { code, error } = props

  const ogp = post
    ? {
        title: post.title,
        description: post.description,
        image: post.owner.avatar,
      }
    : {
        title: 'エラー',
        description: 'エラー',
        image: null,
      }

  return (
    <Box>
      <Head>
        <title>{`${ogp.title} - Hagetter`}</title>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:description" content={ogp.description} />
        {ogp.image && <meta property="og:image" content={ogp.image} />}
      </Head>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Box sx={styles.shareButtons}>
          <AnyShare />
        </Box>
        <Container sx={styles.container}>
          {code === 404 && <NextError statusCode={404} />}
          {code === 200 && <PostContent post={post} />}
          {code !== 200 && code !== 404 && (
            <p>エラー：{error ?? '不明なエラー'}</p>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default PostPage
