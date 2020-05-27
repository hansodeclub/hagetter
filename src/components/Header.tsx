import * as React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import { useSession } from '../stores'
import Avatar from '@material-ui/core/Avatar'
import { observer } from 'mobx-react-lite'
import { Slide } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appbar: {
      color: '#000000',
      backgroundColor: theme.header.light,
      borderBottom: '1px solid #aaa',
    },
    toolbar: {
      justifyContent: 'space-between',
    },

    /* Left side of AppBar */
    left: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontFamily: "'Roboto Condensed', sans-serif",
      fontWeight: 700,
      //textTransform: 'uppercase',
    },
    a: {
      textDecoration: 'none',
      color: 'black',
    },

    /* Right side of AppBar */
    right: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    username: {
      marginRight: 5,
    },
    matomeButton: {
      marginRight: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
)

interface UserMenuProps {
  acct: string
}

const UserMenu: React.FC<UserMenuProps> = observer(({ acct }) => {
  const classes = useStyles({})
  const session = useSession()

  return (
    <List>
      <Box m={1}>
        <Typography
          className={classes.username}
          color="textSecondary"
          variant="subtitle2"
          noWrap
        >
          ユーザー名
        </Typography>
        <Typography
          className={classes.username}
          color="textSecondary"
          variant="subtitle1"
          noWrap
        >
          {acct}
        </Typography>
      </Box>
      <Divider />
      <Link href="/user/[username]/posts" as={`/user/${acct}/posts`}>
        <ListItem button>
          <ListItemText primary="まとめ一覧" />
        </ListItem>
      </Link>
      <Divider />
      <ListItem button onClick={() => session.logout()}>
        <ListItemText primary="ログアウト" />
      </ListItem>
    </List>
  )
})

const Header: React.FC = observer(() => {
  const classes = useStyles({})
  const trigger = useScrollTrigger({})
  const session = useSession()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const showPop = Boolean(anchorEl)

  return (
    <>
      <Slide appear={false} in={!trigger}>
        <AppBar className={classes.appbar} elevation={0}>
          <Toolbar className={classes.toolbar}>
            <Box className={classes.left}>
              <Typography variant="h6" className={classes.title}>
                <Link href="/">
                  <a className={classes.a}>Hagetter</a>
                </Link>
              </Typography>
            </Box>
            <Box className={classes.right}>
              {!session.loading && !session.account && (
                <Link href="/login">
                  <Button>ログイン</Button>
                </Link>
              )}
              {!session.loading && session.account && (
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

                  <IconButton
                    onClick={handleClick}
                    disableFocusRipple={true}
                    disableRipple={true}
                    style={{ backgroundColor: 'transparent', padding: 0 }}
                  >
                    <Avatar src={session.account.avatar} />
                  </IconButton>

                  <Popover
                    open={showPop}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <UserMenu acct={session.account.acct} />
                  </Popover>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  )
})

export default Header
