import * as React from 'react'

import NextError from 'next/error'
import { useRouter } from 'next/router'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'

import { ErrorReport } from '@/core/domains/error/ErrorReport'

import { HagetterClient } from '@/lib/hagetterClient'
import head from '@/lib/head'

const Post = () => {
  const router = useRouter()
  const eid = head(router.query.eid)
  const [loading, setLoading] = React.useState(true)
  const [code, setCode] = React.useState<number>()
  const [item, setItem] = React.useState<ErrorReport>()

  React.useEffect(() => {
    let unmounted = false
    if (!eid) return
    const hagetterClient = new HagetterClient()
    hagetterClient.getError(eid).then((report) => {
      setItem(report)
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
