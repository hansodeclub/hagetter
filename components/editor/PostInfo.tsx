import React from 'react';
import { Account } from '../../utils/mastodon/types';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { useSession, useEditor, observer } from '../../stores';
import cookie from 'js-cookie';

const useStyles = makeStyles(theme =>
  createStyles({
    postButtonContainer: {
      marginTop: 20,
      textAlign: 'right'
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
);

const PostInfo = observer(() => {
  const classes = useStyles({});
  const session = useSession();
  const editor = useEditor();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  React.useEffect(() => {
    session
      .getAccount()
      .then(account => {})
      .catch(err => {
        console.log(err);
      });
  }, []);

  const onSubmit = () => {
    if (!title || !description) {
      alert('タイトル、説明は必須入力です');
      return;
    }
    const token = cookie.get('token');
    if (!token) {
      console.error('Not logged in');
    }

    const body = {
      title,
      description,
      data: editor.items.toJS()
    };

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    };

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    };

    fetch('/api/post', options)
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);
  };

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
              @{session.account.acct}
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
          onChange={event => setTitle(event.target.value)}
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
          onChange={event => setDescription(event.target.value)}
        />
      </div>
      <div className={classes.postButtonContainer}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          投稿する
        </Button>
      </div>
    </div>
  );
});

export default PostInfo;
