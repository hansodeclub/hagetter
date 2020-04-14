import * as React from 'react'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import head from '../../utils/head'
import NextError from 'next/error'
import { getError } from '../../utils/hage'

const Post = () => {
  const router = useRouter()
  const eid = head(router.query.eid)
  const [loading, setLoading] = React.useState(true)
  const [code, setCode] = React.useState<number>()
  const [item, setItem] = React.useState<any>()

  React.useEffect(() => {
    let unmounted = false
    if (!eid) return
    getError(eid).then((result) => {
      setItem(result.data)
      setLoading(false)
      setCode(200)
    })

    return () => {
      unmounted = true
    }
  }, [eid])

  return (
    <div>
      <Container>
        {loading && <CircularProgress />}
        {!loading && code === 404 && <NextError statusCode={404} />}
        {!loading && code === 200 && item && (
          <div>
            <p>{item.page}</p>
            <p>{item.time}</p>
            <div style={{ backgroundColor: '#fee', padding: 5 }}>
              StackTrace
              <br />
              {item.stack.map((line) => (
                <>
                  {line}
                  <br />
                </>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

export default Post
