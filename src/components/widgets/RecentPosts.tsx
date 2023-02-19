import React from 'react'

import moment from 'moment-timezone'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

import Avatar from '@/components/Avatar'

import { HagetterPostInfo } from '@/core/domains/post/HagetterPost'

const styles: { [key: string]: SxProps<Theme> } = {
  matomeTitle: {
    padding: 1,
  },
  itemBox: {
    minHeight: 50,
    borderTop: '1px solid grey',
    margin: 0,
    typography: 'body2',
  },
  name: {
    paddingTop: 1,
    height: 30,
    marginLeft: 1,
  },
  avatar: {
    width: 32,
    height: 32,
  },
  innerBox: {
    textDecoration: 'none',
    margin: 0,
    paddingLeft: 1,
    paddingRight: 1,
    paddingBottom: 1,
    color: '#000',
    '&:hover': {
      backgroundColor: '#eee',
      color: 'orange',
    },
  },
  title: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
  },
  footer: {
    paddingLeft: 1,
    paddingRight: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  grow: {
    flexGrow: 1,
  },
}

const Content: React.FC<{ items: HagetterPostInfo[] }> = ({ items }) => {
  return (
    <Box>
      {items.map((item) => (
        <Box key={item.id} sx={styles.itemBox}>
          <a href={`/hi/${item.id}`} style={{ textDecoration: 'none' }}>
            <Box sx={styles.innerBox}>
              <Box sx={styles.title}>{item.title}</Box>
              <Box sx={styles.footer}>
                <Avatar
                  src={item.owner.avatar}
                  acct={item.owner.acct}
                  alt=""
                  sx={styles.avatar}
                />
                <Box sx={styles.name}>{item.owner.displayName}</Box>
                <Box sx={styles.grow} />
                <Box style={{ marginTop: 5 }}>
                  {moment(item.createdAt)
                    .tz('Asia/Tokyo')
                    .format('YYYY/MM/DD hh:mm')}
                </Box>
              </Box>
            </Box>
          </a>
        </Box>
      ))}
    </Box>
  )
}

export interface Props {
  posts: HagetterPostInfo[]
  cursor?: string | null
  error?: string
}

const RecentPosts = ({ posts, error }: Props) => {
  return (
    <Box>
      <Typography variant="body1" sx={styles.matomeTitle}>
        <strong>新着まとめ</strong>
      </Typography>
      {error && <p>{error}</p>}
      {!error && <Content items={posts} />}
    </Box>
  )
}

export default RecentPosts
