import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import NextError from 'next/error'

import Container from '@mui/material/Container'
import { SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'

import Header from '@/components/Header'
import PostContent from '@/components/post/PostContent'

import { HagetterPost, parseHagetterPost } from '@/entities/HagetterPost'
import { PostFirestoreRepository } from '@/infrastructure/firestore/PostFirestoreRepository'
import { JsonString, toJson, fromJson } from '@/utils/serializer'
import head from '@/utils/head'

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
      border: theme.app.border,
      borderRadius: 1,
      padding: '10px 5px',
      backgroundColor: '#fff',
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
    const postRepository = new PostFirestoreRepository()
    const post = await postRepository.getPost(hid)
    context.res.setHeader('Cache-control', 'public, s-maxage=31536000')

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
      <Container sx={styles.container}>
        {code === 404 && <NextError statusCode={404} />}
        {code === 200 && <PostContent post={post} />}
        {code !== 200 && code !== 404 && (
          <p>エラー：{error ?? '不明なエラー'}</p>
        )}
      </Container>
    </Box>
  )
}

export default PostPage
