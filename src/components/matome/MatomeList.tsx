import * as React from 'react'

import moment from 'moment'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

import { getRecentPublicPost } from '@/features/posts/api'
import { HagetterPostInfo } from '@/features/posts/types'

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
                <Avatar src={item.owner.avatar} sx={styles.avatar} />
                <Box sx={styles.name}>{item.owner.displayName}</Box>
                <Box sx={styles.grow} />
                <Box style={{ marginTop: 5 }}>
                  {moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')}
                </Box>
              </Box>
            </Box>
          </a>
        </Box>
      ))}
    </Box>
  )
}

const MatomeList = () => {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<HagetterPostInfo[]>()
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    let unmounted = false

    getRecentPublicPost({ limit: 300 })
      .then((result) => {
        if (!unmounted) {
          setItems(result.items)
          setLoading(false)
        }
      })
      .catch((err) => {
        setError('ポストを取得出来ませんでした')
        setLoading(false)
      })
    return () => {
      unmounted = true
    }
  }, [])

  return (
    <Box>
      <Typography variant="body1" sx={styles.matomeTitle}>
        <strong>新着まとめ</strong>
      </Typography>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ margin: 2 }} />
        </Box>
      )}
      {!loading && !error && items && <Content items={items} />}
      {!loading && error && <p>{error}</p>}
    </Box>
  )
}

export default MatomeList
