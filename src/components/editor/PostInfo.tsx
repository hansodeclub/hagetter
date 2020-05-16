import React from 'react'
import { Account } from '../../utils/mastodon/types'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import { useStore, useSession, useEditor, observer } from '../../stores'
import Router from 'next/router'
import { createPost } from '../../utils/hage'

const useStyles = makeStyles((theme) =>
  createStyles({
    postButtonContainer: {
      marginTop: 20
    },
    title: {
      display: 'flex'
    },
    titleText: {
      margin: 'auto',
      marginRight: theme.spacing(1)
    },
    titleLogo: {
      color: 'black',
      textDecoration: 'none'
    },
    grow: {
      flexGrow: 1
    }
  })
)

const PostInfo = observer(() => {
  const classes = useStyles({})
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
      .then((account) => {
      })
      .catch(app.notifyError)
  }, [])

  React.useEffect(() => {
    if (editor.hasPrivateStatus && editor.visibility === 'public') editor.setVisibility('unlisted')
  }, [editor.hasPrivateStatus])

  const handleUnlistedChange = (event) => {
    if (editor.hasPrivateStatus) {
      editor.setVisibility('unlisted')
    } else {
      editor.setVisibility(event.target.checked ? 'unlisted' : 'public')
    }
  }

  const successPost = (res) => {
    Router.push(`/hi/${res.data.key}`)
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

    createPost(
      session.token,
      editor.title,
      editor.description,
      editor.hasPrivateStatus ? 'unlisted' : editor.visibility as any,
      editor.items.map((item) => item.postData) as any[],
      editor.hid
    )
      .then((data) => {
        successPost(data)
        setPostLoading(false)
      })
      .catch((err) => {
        app.notifyError(err)
        setPostLoading(false)
      })
  }

  return (
    <div>
      <div className={classes.title}>
        <Link href="/">
          <a className={classes.titleLogo}>
            <Typography variant="h6">Hagetter</Typography>
          </a>
        </Link>
        <div className={classes.grow} />
        {session.account && (
          <>
            <Typography variant="subtitle1" className={classes.titleText}>
              {session.account.acct}
            </Typography>
            <Avatar src={session.account.avatar} />
          </>
        )}
      </div>
      <h3>タイトル</h3>
      <div>
        <TextField
          variant="outlined"
          fullWidth
          style={{ backgroundColor: 'white' }}
          defaultValue={editor.title}
          onChange={(event) => editor.setTitle(event.target.value)}
        />
      </div>
      <h3>説明文</h3>
      <div>
        <TextField
          multiline
          variant="outlined"
          fullWidth
          rows={4}
          style={{ backgroundColor: 'white' }}
          defaultValue={editor.description}
          onChange={(event) => editor.setDescription(event.target.value)}
        />
      </div>
      <div className={classes.postButtonContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={editor.visibility!=='public' || editor.hasPrivateStatus}
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
        >
          投稿する
        </Button>
      </div>
      <div>
        {editor.hasPrivateStatus && (
          <p style={{ color: '#ff4040' }}>
            ※非公開のステータスを含むため未収載のみ選択可能です(URLの取り扱いには大いなる責任が伴います)
          </p>
        )}
        <p>
          ※未収載を選択するとまとめ一覧に表示されません(URLを知っている人は誰でも見る事が出来ます)
        </p>
      </div>
    </div>
  )
})

export default PostInfo
