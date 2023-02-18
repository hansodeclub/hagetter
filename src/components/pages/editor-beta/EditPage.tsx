import React from 'react'

import { observer } from 'mobx-react-lite'
import NextError from 'next/error'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import { SxProps, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Logo from '@/components/Logo'
import BottomBar from '@/components/pages/editor-beta/BottomBar'
import SideContent, {
  TimelineName,
} from '@/components/pages/editor-beta/SideContent'
import StatusSelectorBeta from '@/components/pages/editor-beta/StatusSelectorBeta'
import MultiSelectMenu from '@/components/pages/editor-beta/menus/MultiSelectMenu'

import { HagetterClient } from '@/lib/hagetterClient'
import head from '@/lib/head'
import { useEditor, useSession, useStore } from '@/stores'

import PostEditor, { leftColumnWidth } from './PostEditorBeta'

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

const EditPage: React.FC<{ create?: boolean }> = observer(({ create }) => {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [code, setCode] = React.useState<number>()
  const [error, setError] = React.useState<string>()
  const [submitting, setSubmitting] = React.useState(false)
  const app = useStore()
  const editor = useEditor()
  const session = useSession()

  const [timeline, setTimeline] = React.useState<TimelineName | undefined>()
  const [showTimeline, setShowTimeline] = React.useState<boolean>(undefined)

  const isMobile = !useMediaQuery('(min-width:1170px)')
  const invisible =
    isMobile &&
    ((showTimeline === undefined && isMobile) || showTimeline === false)

  const hid = head(router.query.hid)
  React.useEffect(() => {
    if (create) {
      editor.reset()
      setCode(200)
      setLoading(false)
      return
    }
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
          editor.reset()
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

  const onSubmit = async () => {
    if (submitting) return
    if (!editor.title || !editor.description) {
      alert('タイトル、説明は必須入力です')
      setSubmitting(false)
      return
    }

    if (!session.loggedIn) {
      console.error('Not logged in')
      alert('ログインしていないようです')
      setSubmitting(false)
      return
    }

    setSubmitting(true)

    const hagetterClient = new HagetterClient()
    hagetterClient
      .createPost(
        session.token,
        editor.title,
        editor.description,
        editor.hasPrivateStatus ? 'unlisted' : (editor.visibility as any),
        editor.items.map((item) => item.postData) as any[],
        editor.hid
      )
      .then((key) => {
        router.push(`/hi/${key}`)
        setSubmitting(false)
      })
      .catch((err) => {
        app.notifyError(err)
        setSubmitting(false)
      })
  }

  if (error) {
    return <p>{error}</p>
  }
  if (code === 404) {
    return <NextError statusCode={404} />
  }

  return (
    <Box sx={{ mb: '72px' }}>
      <Box
        sx={{
          m: 1,
          display: 'flex',
          alignItems: 'center',
          maxWidth: 632 + leftColumnWidth,
          marginRight: '72px',
        }}
      >
        <Box>
          <Logo />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ fontSize: 'small' }}>
          <Link
            href={!hid ? '/create' : `/edit/${hid}`}
            style={{ color: 'black' }}
          >
            旧バージョンはこちら
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: 632 + leftColumnWidth,
          margin: 1,
          ml: 1 - (isMobile ? 1 : 0),
          mr: 7 - (isMobile ? 1 : 0),
          padding: 2,
          marginBottom: '300px',
          // border: (theme) => theme.app.border,
          backgroundColor: '#fff',
          boxShadow: isMobile ? 0 : 3,
        }}
      >
        {loading && <CircularProgress />}
        {!loading && code === 200 && <PostEditor isMobile={isMobile} />}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          marginRight: '48px',
          height: '100vh',
          backgroundColor: 'white',
          borderLeft: (theme) => theme.app.border,
          visibility: invisible ? 'hidden' : 'visible',
        }}
      >
        <StatusSelectorBeta timeline={timeline} invisible={invisible} />
      </Box>
      <Drawer
        variant="permanent"
        anchor="right"
        PaperProps={{
          sx: { width: '48px', zIndex: (theme) => theme.zIndex.appBar - 1 },
        }}
      >
        <SideContent
          timeline={timeline}
          setTimeline={setTimeline}
          showBurgerMenu={isMobile}
          showTimeline={showTimeline}
          toggleDrawer={() => setShowTimeline(!showTimeline)}
        />
      </Drawer>
      {editor.selectedCount >= 1 && <MultiSelectMenu isMobile={isMobile} />}
      <BottomBar onSubmit={onSubmit} submitting={submitting} />
    </Box>
  )
})

export default EditPage
