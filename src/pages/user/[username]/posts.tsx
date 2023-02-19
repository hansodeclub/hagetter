import * as React from 'react'

import { useObserver } from 'mobx-react-lite'
import moment from 'moment'
import { useRouter } from 'next/router'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import Header from '@/components/Header'

import { HagetterClient } from '@/lib/hagetterClient'
import head from '@/lib/head'
import { useSession, useStore } from '@/stores'

const UserPost = () => {
  const app = useStore()
  const session = useSession()
  const router = useRouter()

  const username = head(router.query.username)
  const [loading, setLoading] = React.useState(true)
  const [invoke, setInvoke] = React.useState(false)
  const [items, setItems] = React.useState<any>()

  React.useEffect(() => {
    let unmounted = false
    if (!username) return
    setLoading(true)

    const hagetterClient = new HagetterClient()
    hagetterClient
      .getMyPosts(username, session.token)
      .then((result) => {
        if (!unmounted) {
          setItems(result.items)
          setLoading(false)
        }
      })
      .catch((err) => {
        app.notifyError(err)
        setLoading(false)
      })
    return () => {
      unmounted = true
    }
  }, [username, invoke])

  const onDeletePost = (id: string) => {
    if (window.confirm('削除しますか?')) {
      const hagetterClient = new HagetterClient()
      hagetterClient
        .deletePost(id, session.token)
        .then((_) => {
          setInvoke(!invoke)
        })
        .catch(app.notifyError)
    }
  }

  return useObserver(() => (
    <div>
      <Header />
      <Container>
        {loading && <CircularProgress sx={{ margin: 3 }} />}
        {!loading && (
          <div>
            <h4>あなたのまとめ一覧</h4>
            <ul>
              {!loading &&
                items &&
                items.map((item) => (
                  <li key={item.id}>
                    <a href={`/hi/${item.id}`}>{item.title}</a>
                    {item.visibility === 'unlisted' && '(未収載)'}{' '}
                    {moment(item.created_at).format('YYYY-MM-DD hh:mm:ss')}
                    <button onClick={() => onDeletePost(item.id)}>削除</button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  ))
}

export default UserPost
