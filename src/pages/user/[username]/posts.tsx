import * as React from 'react'
import { useRouter } from 'next/router'
import Header from '~/components/Header'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import head from '~/utils/head'
import { HagetterApiClient } from '~/utils/hage'
import { useStore, useSession } from '~/stores'
import moment from 'moment'
import { useObserver } from 'mobx-react-lite'

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

    const hagetterClient = new HagetterApiClient()
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
      const hagetterClient = new HagetterApiClient()
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
                    {moment(item.created_at).format('YYYY-MM-DD HH:MM:SS')}
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
