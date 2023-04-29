import React from 'react'

import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/router'

import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { ListItemIcon, SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'

import { useSession } from '@/stores'

const styles: { [key: string]: SxProps<Theme> } = {
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
    //fontFamily: "'Roboto Condensed', sans-serif",
    fontWeight: 700,
    //textTransform: 'uppercase',
  },
  a: {
    textDecoration: 'none',
    color: 'black',
    fontSize: 24,
    //fontFamily: "'Roboto Condensed', sans-serif",
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
  displayName: string
  acct: string
  onLogout?: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({
  displayName,
  acct,
  onLogout = () => {},
}) => {
  const router = useRouter()

  return (
    <MenuList dense>
      <MenuItem onClick={() => router.push(`/user/${acct}/posts`)}>
        <Box>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" noWrap>
              {displayName}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={styles.username}
              color="textSecondary"
              variant="subtitle1"
              noWrap
            >
              {acct}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => router.push('/entries')}>
        <ListItemIcon>
          <FeedOutlinedIcon />
        </ListItemIcon>
        <ListItemText>投稿の管理</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => onLogout()}>
        <ListItemIcon>
          <LogoutOutlinedIcon />
        </ListItemIcon>
        <ListItemText>ログアウト</ListItemText>
      </MenuItem>
    </MenuList>
  )
}

export default UserMenu
