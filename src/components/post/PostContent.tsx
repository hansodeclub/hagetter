import * as React from 'react'

import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

import Avatar from '@/components/Avatar'
import Toot from '@/components/Toot/Toot'
import { TextItem } from '@/components/matome/Item'

import { HagetterPost } from '@/core/domains/post/HagetterPost'
import { Status } from '@/core/domains/post/Status'

import { useSession } from '@/stores'

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
  grow: {
    flexGrow: 1,
  },
}

export interface PostContentProps {
  post: HagetterPost
}

const PostContent = observer<PostContentProps>(({ post }) => {
  const session = useSession()
  const router = useRouter()
  const isOwner =
    session.loggedIn &&
    session.account &&
    session.account.acct === post.owner.acct

  return (
    <Box>
      <Typography variant="h5">
        <b>{post['title']}</b>
      </Typography>
      <Typography variant="body2">{post['description']}</Typography>
      <Box sx={styles.footer}>
        <Avatar
          src={post.owner.avatar}
          acct={post.owner.acct}
          alt=""
          sx={styles.avatar}
        />
        <Box sx={styles.name}>{post.owner.displayName}</Box>
        <Box sx={styles.grow} />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            {moment(post.createdAt).format('YYYY-MM-DD hh:mm')}
          </Typography>
        </Box>
        {isOwner && (
          <Box sx={{ ml: 1 }}>
            <button onClick={() => router.push(`/edit/beta/${post.id}`)}>
              編集
            </button>
          </Box>
        )}
      </Box>
      <hr />
      <Box>
        {post.contents.map((item) => (
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
      <Toot
        variant={item.size}
        color={item.color}
        status={item.data as Status}
      />
    )
  } else if (item.type === 'text') {
    const textItem: any = item.data // TODO: Add type checking

    return (
      <TextItem text={textItem.text} variant={item.size} color={item.color} />
    )
  } else {
    throw Error(`Unknown item type: ${item.type}`)
  }
}

export default PostContent
