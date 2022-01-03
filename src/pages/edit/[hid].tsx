import React from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { makeStyles, createStyles } from '@mui/material/styles'
import StatusSelector from '~/components/editor/StatusSelector'
import PostEditor from '~/components/editor/PostEditor'
import PostInfoEditor from '~/components/editor/PostInfoEditor'
import head from '~/utils/head'
import { HagetterApiClient } from '~/utils/hage'
import { useRouter } from 'next/router'
import Header from '~/components/Header'
import CircularProgress from '@mui/material/CircularProgress'
import NextError from 'next/error'
import { useEditor, useSession, observer } from '~/stores'
import { SxProps, Theme } from '@mui/material/styles'

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    minWidth: 1000,
  },
  gridContainer: {
    height: '100vh',
    overflow: 'hidden',
    paddingTop: 1,
    boxSizing: 'border-box',
  },
  gridColumn: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
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
      .getPostSecure(hid, session.token)
      .then((data) => {
        if (!unmounted) {
          editor.setId(hid)
          editor.setTitle(data.title)
          editor.setDescription(data.description)
          editor.bulkAdd(data.data)
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
      <Header />
      <Container sx={styles.container}>
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
    <Grid container spacing={2} sx={styles.gridContainer}>
      <Grid item xs={4} sx={styles.gridColumn}>
        <StatusSelector />
      </Grid>
      <Grid item xs={4} sx={styles.gridColumn}>
        <PostEditor />
      </Grid>
      <Grid item xs={4}>
        <PostInfoEditor />
      </Grid>
    </Grid>
  )
}

export default EditPage
