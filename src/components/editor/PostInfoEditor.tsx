import * as React from 'react'

import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import Router from 'next/router'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

import { HagetterClient } from '@/lib/hagetterClient'
import { useEditor, useSession, useStore } from '@/stores'

const styles: { [key: string]: SxProps<Theme> } = {
  postButtonContainer: {
    marginTop: 2,
  },
  title: {
    display: 'flex',
  },
  titleText: {
    margin: 'auto',
    marginRight: 1,
  },
  titleLogo: {
    color: 'black',
    textDecoration: 'none',
  },
  grow: {
    flexGrow: 1,
  },
}

const PostInfoEditor = observer(() => {
  const session = useSession()
  const editor = useEditor()
  const app = useStore()

  //const [title, setTitle] = React.useState('')
  //const [description, setDescription] = React.useState('')
  // const [unlisted, setUnlisted] = React.useState(false)
  const [postLoading, setPostLoading] = React.useState(false)

  React.useEffect(() => {
    session
      .getAccount()
      .then((_account) => {})
      .catch(app.notifyError)
  }, [])

  React.useEffect(() => {
    if (editor.hasPrivateStatus && editor.visibility === 'public')
      editor.setVisibility('unlisted')
  }, [editor.hasPrivateStatus])

  const handleUnlistedChange = (event) => {
    if (editor.hasPrivateStatus) {
      editor.setVisibility('unlisted')
    } else {
      editor.setVisibility(event.target.checked ? 'unlisted' : 'public')
    }
  }

  const successPost = async (key) => {
    await Router.push(`/hi/${key}`)
  }

  const onSubmit = () => {
    if (postLoading) return
    if (!editor.title || !editor.description) {
      alert('タイトル、説明は必須入力です')
      return
    }

    // const token = cookie.get('token');
    if (!session.loggedIn) {
      console.error('Not logged in')
      alert('ログインしていないようです')
      return
    }

    setPostLoading(true)

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
        successPost(key)
        setPostLoading(false)
      })
      .catch((err) => {
        app.notifyError(err)
        setPostLoading(false)
      })
  }

  return (
    <Box>
      <Box sx={styles.title}>
        <Link href="/">
          <a style={{ color: 'black', textDecoration: 'none' }}>
            <Typography variant="h6">Hagetter</Typography>
          </a>
        </Link>
        <Box sx={styles.grow} />
        {session.account && (
          <>
            <Typography variant="subtitle1" sx={styles.titleText}>
              {session.account.acct}
            </Typography>
            <Avatar src={session.account.avatar} />
          </>
        )}
      </Box>
      <h3>タイトル</h3>
      <Box>
        <TextField
          variant="outlined"
          fullWidth
          style={{ backgroundColor: 'white' }}
          defaultValue={editor.title}
          onChange={(event) => editor.setTitle(event.target.value)}
        />
      </Box>
      <h3>説明文</h3>
      <Box>
        <TextField
          multiline
          variant="outlined"
          fullWidth
          rows={4}
          style={{ backgroundColor: 'white' }}
          defaultValue={editor.description}
          onChange={(event) => editor.setDescription(event.target.value)}
        />
      </Box>
      <Box sx={styles.postButtonContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={
                editor.visibility !== 'public' || editor.hasPrivateStatus
              }
              onChange={handleUnlistedChange}
              value="unlisted"
            />
          }
          label="未収載"
        />
        {postLoading && <CircularProgress />}
        <Button
          variant="contained"
          color="primary"
          style={{ float: 'right' }}
          onClick={onSubmit}
          disableElevation
        >
          投稿する
        </Button>
      </Box>
      <Box>
        {editor.hasPrivateStatus && (
          <p style={{ color: '#ff4040' }}>
            ※非公開のステータスを含むため未収載のみ選択可能です(URLの取り扱いには大いなる責任が伴います)
          </p>
        )}
        <p>
          ※未収載を選択するとまとめ一覧に表示されません(URLを知っている人は誰でも見る事が出来ます)
        </p>
      </Box>
    </Box>
  )
})

export default PostInfoEditor
