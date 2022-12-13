import React from 'react'

import HomeIcon from '@mui/icons-material/HomeRounded'
import LinkIcon from '@mui/icons-material/LinkRounded'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/PeopleRounded'
import PublicIcon from '@mui/icons-material/PublicRounded'
import SearchIcon from '@mui/icons-material/SearchRounded'
import StarIcon from '@mui/icons-material/StarRounded'
import { ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import List from '@mui/material/List'

interface ItemProps {
  icon: React.ReactNode
  label: string
  value: TimelineName
}

const items: ItemProps[] = [
  { icon: <HomeIcon />, label: 'Home', value: 'home' },
  { icon: <PeopleIcon />, label: 'Local', value: 'local' },
  { icon: <PublicIcon />, label: 'Public', value: 'public' },
  { icon: <StarIcon />, label: 'Starred', value: 'favourites' },
  { icon: <SearchIcon />, label: 'Search', value: 'search' },
  { icon: <LinkIcon />, label: 'URL', value: 'urls' },
]

export type TimelineName =
  | 'home'
  | 'local'
  | 'public'
  | 'favourites'
  | 'search'
  | 'urls'

export interface SideContentProps {
  timeline?: TimelineName
  setTimeline: (timeline: TimelineName) => void
  toggleDrawer?: () => void
  showTimeline?: boolean
  showBurgerMenu: boolean
}

const SideContent: React.FC<SideContentProps> = ({
  timeline,
  setTimeline,
  toggleDrawer,
  showTimeline,
  showBurgerMenu,
}) => {
  const onClick = (value: TimelineName) => () => {
    setTimeline && setTimeline(value)

    if (showBurgerMenu && toggleDrawer) {
      if (value === timeline && showTimeline) {
        toggleDrawer()
      } else if (!showTimeline) {
        toggleDrawer()
      }
    }
  }

  return (
    <List>
      {items.map(({ icon, label, value }) => (
        <ListItem
          key={value}
          disablePadding
          sx={{
            display: 'block',
            backgroundColor: value === timeline ? '#2196f3' : 'inherit',
          }}
        >
          <ListItemButton
            key={value}
            sx={{ display: 'block', px: 1.5, m: 0 }}
            onClick={onClick(value)}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mx: 0,
                justifyContent: 'center',
                color: value === timeline ? 'white' : 'inherit',
              }}
            >
              {icon}
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default SideContent
