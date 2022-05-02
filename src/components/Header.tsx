import * as React from 'react'
import { Theme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useSession } from '@/stores'
import Avatar from '@mui/material/Avatar'
import { observer } from 'mobx-react-lite'
import Slide from '@mui/material/Slide'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { SxProps } from '@mui/material'

const styles: SxProps<Theme> = {
  appbar: {
    color: '#000000',
    backgroundColor: (theme: Theme) => theme.header.light,
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
    fontSize: 24,
    fontFamily: "'Roboto Condensed', sans-serif",
    fontWeight: 700,
  },

  /* Right side of AppBar */
  right: {
    //flex: 1,
    //display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  username: {
    marginRight: 5,
  },
  matomeButton: {
    marginRight: 2,
  },
  menuButton: {
    marginRight: 2,
  },
}

interface UserMenuProps {
  acct: string
}

const UserMenu: React.FC<UserMenuProps> = observer(({ acct }) => {
  const session = useSession()

  return (
    <List>
      <Box m={1}>
        <Typography
          sx={styles.username}
          color="textSecondary"
          variant="subtitle2"
          noWrap
        >
          ユーザー名
        </Typography>
        <Typography
          sx={styles.username}
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
        <AppBar sx={styles.appbar} elevation={0}>
          <Toolbar sx={styles.toolbar}>
            <Box sx={styles.left}>
              <Link href="/">
                <a
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                    fontSize: 24,
                    fontFamily: "'Roboto Condensed', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Hagetter
                </a>
              </Link>
            </Box>
            <Box sx={styles.right}>
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
                      color="primary"
                      sx={styles.matomeButton}
                      disableElevation
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
