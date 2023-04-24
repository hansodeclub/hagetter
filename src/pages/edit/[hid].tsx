import React from 'react'

import { observer } from 'mobx-react-lite'
import NextError from 'next/error'
import { useRouter } from 'next/router'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { SxProps, Theme } from '@mui/material/styles'

import PostEditor from '@/components/editor/PostEditor'
import PostInfoEditor from '@/components/editor/PostInfoEditor'
import StatusSelector from '@/components/editor/StatusSelector'

import { HagetterApiClient } from '@/lib/hagetterApiClient'
import head from '@/lib/utils/head'
import { useEditor, useSession } from '@/stores'

const gridStyle: SxProps<Theme> = {
  height: '100vh',
  paddingTop: 1,
  paddingBottom: 1,
}

const columnStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const EditPage = observer(() => {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [code, setCode] = React.useState<number>()
  const [error, setError] = React.useState<string>()
  const editor = useEditor()
  const session = useSession()

  const hid = head(router.query.hid)
  React.useEffect(() => {
    let unmounted = false
    if (!hid) return
    if (!session.loading && !session.loggedIn) {
      setError('ログインしていません')
    }

    const hagetterClient = new HagetterApiClient()
    hagetterClient
      .getVerifiablePost(hid, session.token)
      .then((data) => {
        if (!unmounted) {
          editor.setId(hid)
          editor.setTitle(data.title)
          editor.setDescription(data.description)
          editor.bulkAdd(data.contents)
          editor.setVisibility(data.visibility as any)
          setCode(200)
          setLoading(false)
        }
      })
      .catch((err) => {
        setCode(500)
        setLoading(false)
      })
    return () => {
      unmounted = true
    }
  }, [hid, session.loading])

  return (
    <div>
      <Container sx={{ minWidth: 1000 }}>
        {error && <p>{error}</p>}
        {loading && !error && <CircularProgress />}
        {!loading && !error && code === 404 && <NextError statusCode={404} />}
        {!loading && !error && code === 200 && <Content />}
      </Container>
    </div>
  )
})

const Content: React.FC = () => {
  return (
    <Grid container columnSpacing={2} sx={gridStyle}>
      <Grid item xs={4} sx={columnStyle}>
        <StatusSelector />
      </Grid>
      <Grid item xs={4} sx={columnStyle}>
        <PostEditor />
      </Grid>
      <Grid item xs={4}>
        <PostInfoEditor />
      </Grid>
    </Grid>
  )
}

export default EditPage
