import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import { useSession } from '../stores';
import Avatar from '@material-ui/core/Avatar';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appbar: {
      paddingLeft: '5%',
      paddingRight: '5%',
      marginBottom: theme.spacing(2)
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      justifyContent: 'center',
      margin: 'auto',
      marginRight: theme.spacing(1)
    },
    grow: {
      flexGrow: 1
    },
    matomeButton: {
      marginRight: theme.spacing(2)
    },
    rightSide: {
      display: 'flex',
      justifyContent: 'center'
    }
  })
);

const Header: React.FC = observer(() => {
  const classes = useStyles({});

  // TODO: HOCにしたい
  const session = useSession();
  React.useEffect(() => {
    session
      .getAccount()
      .then(account => {})
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <AppBar color="default" position="static" className={classes.appbar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link href="/">
            <a style={{ textDecoration: 'none', color: 'black' }}>Hagetter</a>
          </Link>
        </Typography>
        <div className={classes.grow} />
        <div className={classes.rightSide}>
          {!session.initializing && !session.loading && !session.account && (
            <Link href="/login">
              <Button>ログイン</Button>
            </Link>
          )}
          {!session.initializing && !session.loading && session.account && (
            <>
              <Link href="/create">
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.matomeButton}
                >
                  まとめを作る
                </Button>
              </Link>
              <Typography className={classes.title} variant="subtitle1" noWrap>
                {session.account.acct}
              </Typography>
              <Link href={`/user/${session.account.acct}/posts`}>
                <Avatar
                  src={session.account.avatar}
                  style={{ cursor: 'pointer' }}
                />
              </Link>
              <Button onClick={() => session.logout()}>ログアウト</Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
