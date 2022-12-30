import * as React from 'react'

import { GetServerSideProps, NextPage } from 'next'
import NextError from 'next/error'
import Head from 'next/head'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { SxProps, Theme } from '@mui/material/styles'

import Header from '@/components/Header'
import PostContent from '@/components/post/PostContent'

import {
  HagetterPost,
  parseHagetterPost,
} from '@/core/domains/post/HagetterPost'
import { PostFirestoreRepository } from '@/core/infrastructure/server-firestore/PostFirestoreRepository'

import { sendCacheControl } from '@/lib/cdn/cloudflare'
import head from '@/lib/head'
import { JsonString, fromJson, toJson } from '@/lib/serializer'

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
    const postRepository = new PostFirestoreRepository()
    const post = await postRepository.getPost(hid)

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

const AnyShare: React.FC = () => {
  return (
    <div>
      <a
        href="https://anypost.dev/share"
        onClick={(e) => {
          window.open(
            'https://anypost.dev/share?s=' +
              location.href +
              '&t=' +
              document.title,
            '',
            'width=500,height=750'
          )
          e.preventDefault()
          return false
        }}
        style={{ color: '#444', textDecorationLine: 'none' }}
      >
        <div
          style={{
            display: 'inline-block',
            background: '#fff',
            border: '1px solid #eee',
            padding: '10px 2px',
            borderRadius: '4px',
            textAlign: 'center',
            width: '60px',
            lineHeight: '7px',
            fontFamily: 'Avenir,Helvetica,Arial,sans-serif',
          }}
        >
          <img
            src="https://anypost.dev/external-assets/share-b.svg"
            width="18"
            alt="share"
          />
          <div style={{ fontSize: '0.3em', marginTop: '9px' }}>anypost.dev</div>
        </div>
      </a>
    </div>
  )
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
