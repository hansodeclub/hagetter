import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import NextError from 'next/error'
import { observer } from 'mobx-react-lite'
import moment from 'moment'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Header from '~/components/Header'
import { TextItem } from '~/components/matome/Item'
import Toot from '~/components/Toot/Toot'

import { useSession } from '~/stores'
import head from '~/utils/head'
import { Status } from '~/utils/mastodon/types'
import { fetchPost } from '~/utils/hage'

import '../App.scss'
import { GetPost } from '~/usecases/GetPost'
import { Convert, HagetterPost } from '@/entities/HagetterPost'
import { JsonString, fromJson, toJson } from '@/utils/serialized'
import { NotFound } from '~/entities/api/status'
import { PostRepositoryFactory } from '~/interfaces/RepositoryFactory'

const useStyles = makeStyles((theme) =>
  createStyles({
    name: {
      paddingTop: 5,
      height: 30,
      marginLeft: 5,
    },
    avatar: {
      width: 32,
      height: 32,
    },
    title: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: 5,
    },
    footer: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      [theme.breakpoints.down('sm')]: {
        padding: '20px 5px',
        width: '100%',
        backgroundColor: '#fff',
      },
      [theme.breakpoints.up('sm')]: {
        maxWidth: 600,
        marginLeft: 10,
        border: '1px solid #ccc',
        borderRadius: 10,
        padding: '10px 5px',
        backgroundColor: '#fff',
      },
    },
    grow: {
      flexGrow: 1,
    },
  })
)

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
  const classes = useStyles({})
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
    <div>
      <Head>
        <title>{ogp.title} - Hagetter</title>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:description" content={ogp.description} />
        {ogp.image && <meta property="og:image" content={ogp.image} />}
      </Head>
      <Header />
      <Container className={classes.container}>
        {code === 404 && <NextError statusCode={404} />}
        {code === 200 && <Content post={post} />}
        {code !== 200 && code !== 404 && (
          <p>エラー：{error ?? '不明なエラー'}</p>
        )}
      </Container>
    </div>
  )
}

const Content = observer<{ post: HagetterPost }>(({ post }) => {
  const classes = useStyles({})
  const session = useSession()
  const router = useRouter()
  const isOwner =
    session.loggedIn &&
    session.account &&
    session.account.acct === post.username

  return (
    <div>
      <Typography variant="h5">
        <b>{post['title']}</b>
      </Typography>
      <Typography variant="body2">{post['description']}</Typography>
      <div className={classes.footer}>
        <Avatar src={post.avatar} className={classes.avatar} />
        <div className={classes.name}>{post.displayName}</div>
        <div className={classes.grow} />
        <div style={{ marginTop: 5 }}>
          {moment(post.created_at).format('YYYY-MM-DD HH:MM')}
        </div>
        {isOwner && (
          <div style={{ paddingLeft: '5px' }}>
            <button onClick={() => router.push(`/edit/${post.id}`)}>
              編集
            </button>
          </div>
        )}
      </div>
      <hr />
      <div>
        {post.data.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
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
