import React from 'react'

import BookmarkIcon from '@mui/icons-material/BookmarkOutlined'
import HomeIcon from '@mui/icons-material/HomeRounded'
import LinkIcon from '@mui/icons-material/LinkRounded'
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
  {
    icon: <HomeIcon sx={{ fontSize: '28px' }} />,
    label: 'Home',
    value: 'home',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: '28px' }} />,
    label: 'Local',
    value: 'local',
  },
  {
    icon: <PublicIcon sx={{ fontSize: '28px' }} />,
    label: 'Public',
    value: 'public',
  },
  {
    icon: <StarIcon sx={{ fontSize: '28px' }} />,
    label: 'Starred',
    value: 'favourites',
  },
  {
    icon: <BookmarkIcon sx={{ fontSize: '28px' }} />,
    label: 'Bookmarks',
    value: 'bookmarks',
  },
  {
    icon: <SearchIcon sx={{ fontSize: '28px' }} />,
    label: 'Search',
    value: 'search',
  },
  { icon: <LinkIcon sx={{ fontSize: '28px' }} />, label: 'URL', value: 'urls' },
]

export type TimelineName =
  | 'home'
  | 'local'
  | 'public'
  | 'favourites'
  | 'bookmarks'
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
}) => {
  const onClick = (value: TimelineName) => {
    if (toggleDrawer) {
      if (value === timeline && showTimeline) {
        toggleDrawer()
      } else if (!showTimeline) {
        toggleDrawer()
      }
    }
    setTimeline && setTimeline(value)
  }

  return (
    <List sx={{ width: 48 }}>
      {items.map(({ icon, label, value }) => (
        <ListItem
          key={value}
          disablePadding
          sx={{
            display: 'block',
          }}
        >
          <ListItemButton
            key={value}
            sx={{
              display: 'block',
              px: 1.2,
            }}
            onClick={() => onClick(value)}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: value === timeline ? '#2196f3' : 'inherit',
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
