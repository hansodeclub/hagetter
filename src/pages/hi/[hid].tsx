import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import NextError from 'next/error'
import { observer } from 'mobx-react-lite'
import moment from 'moment'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { SxProps, Theme } from '@mui/material/styles'

import Header from '~/components/Header'
import { TextItem } from '~/components/matome/Item'
import Toot from '~/components/Toot/Toot'

import { useSession } from '~/stores'
import head from '~/utils/head'
import { Status } from '~/entities/Mastodon'

import { GetPost } from '~/usecases/GetPost'
import { Convert, HagetterPost } from '@/entities/HagetterPost'
import { JsonString, fromJson, toJson } from '@/utils/serialized'
import { PostRepositoryFactory } from '~/interfaces/RepositoryFactory'
import Box from '@mui/material/Box'

const styles: { [key: string]: SxProps<Theme> } = {
  name: {
    paddingTop: 1,
    height: '30px',
    marginLeft: 1,
  },
  avatar: {
    width: 32,
    height: 32,
  },
  title: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 5,
  },
  footer: {
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  container: (theme) => ({
    [theme.breakpoints.down('sm')]: {
      padding: '20px 5px',
      width: '100%',
      backgroundColor: '#fff',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 600,
      marginTop: 1,
      marginLeft: 1,
      border: theme.app.border,
      borderRadius: 1,
      padding: '10px 5px',
      backgroundColor: '#fff',
    },
  }),
  grow: {
    flexGrow: 1,
  },
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
  const action = new GetPost(PostRepositoryFactory.createServer())

  try {
    const post = await action.execute(hid)

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
  const post = props.post
    ? fromJson(props.post, Convert.toHagetterPost)
    : undefined

  const { code, error } = props

  const ogp = post
    ? {
        title: post.title,
        description: post.description,
        image: post.avatar,
      }
    : {
        title: 'エラー',
        description: 'エラー',
        image: null,
      }

  return (
    <Box>
      <Head>
        <title>{ogp.title} - Hagetter</title>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:description" content={ogp.description} />
        {ogp.image && <meta property="og:image" content={ogp.image} />}
      </Head>
      <Header />
      <Container sx={styles.container}>
        {code === 404 && <NextError statusCode={404} />}
        {code === 200 && <Content post={post} />}
        {code !== 200 && code !== 404 && (
          <p>エラー：{error ?? '不明なエラー'}</p>
        )}
      </Container>
    </Box>
  )
}

const Content = observer<{ post: HagetterPost }>(({ post }) => {
  const session = useSession()
  const router = useRouter()
  const isOwner =
    session.loggedIn &&
    session.account &&
    session.account.acct === post.username

  return (
    <Box>
      <Typography variant="h5">
        <b>{post['title']}</b>
      </Typography>
      <Typography variant="body2">{post['description']}</Typography>
      <Box sx={styles.footer}>
        <Avatar src={post.avatar} sx={styles.avatar} />
        <Box sx={styles.name}>{post.displayName}</Box>
        <Box sx={styles.grow} />
        <Box style={{ marginTop: 5 }}>
          {moment(post.created_at).format('YYYY-MM-DD HH:MM')}
        </Box>
        {isOwner && (
          <Box style={{ paddingLeft: '5px' }}>
            <button onClick={() => router.push(`/edit/${post.id}`)}>
              編集
            </button>
          </Box>
        )}
      </Box>
      <hr />
      <Box>
        {post.data.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  )
})

const Item = ({
  item,
  onClick,
}: {
  item: any
  onClick?: (item: any) => any
}) => {
  if (item.type === 'status') {
    return (
      <li style={{ display: 'inline' }}>
        <Toot
          size={item.size}
          color={item.color}
          onClick={() => onClick && onClick(item)}
          selected={item.selected}
          status={item.data as Status}
        />
      </li>
    )
  } else if (item.type === 'text') {
    const textItem: any = item.data // TODO: Add type checking

    return (
      <TextItem
        text={textItem.text}
        variant={item.size}
        color={item.color}
        selected={item.selected}
        onClick={() => onClick && onClick(item)}
      />
    )
  } else {
    throw Error(`Unknown item type: ${item.type}`)
  }
}

export default PostPage
