import React from 'react'
import { useRouter } from 'next/router'
import NextError from 'next/error'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import StatusSelector from '@/components/editor/StatusSelector'
import PostEditor from '@/components/editor/PostEditor'
import PostInfoEditor from '@/components/editor/PostInfoEditor'
import head from '@/utils/head'
import { HagetterClient } from '@/utils/hagetterClient'
import CircularProgress from '@mui/material/CircularProgress'
import { useEditor, useSession } from '@/stores'
import { observer } from 'mobx-react-lite'
import { SxProps, Theme } from '@mui/material/styles'

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

    const hagetterClient = new HagetterClient()
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
