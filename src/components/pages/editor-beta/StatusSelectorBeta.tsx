import React from 'react'

import { observer } from 'mobx-react-lite'

import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

import SearchTimeline from '@/components/editor/SearchTimeline'
import Timeline from '@/components/editor/Timeline'
import UrlSearchTimeline from '@/components/editor/UrlSearchTimeline'
import { TimelineName } from '@/components/pages/editor-beta/SideContent'

const HowTo: React.FC = () => {
  return (
    <Box
      sx={{
        margin: 3,
        paddingTop: 1,
        paddingBottom: 1,
        backgroundColor: '#f1f1f1',
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
        }}
      >
        使い方
      </Typography>
      <ul>
        <li>タイムラインからまとめるやつを探しましょう</li>
        <li>クリックでまとめに追加されます</li>
        <li>まとめには大きな責任が伴います</li>
      </ul>
    </Box>
  )
}

export interface StatusSelectorProps {
  timeline?: TimelineName
  invisible?: boolean
}

const StatusSelector: React.FC<StatusSelectorProps> =
  observer<StatusSelectorProps>(({ timeline, invisible }) => {
    return (
      <Box
        sx={{
          minWidth: 321,
          width: '100%',
          height: '100%',
        }}
      >
        {timeline === 'home' && (
          <Timeline name={timeline} invisible={invisible} />
        )}
        {timeline === 'local' && (
          <Timeline name={timeline} invisible={invisible} />
        )}
        {timeline === 'public' && (
          <Timeline name={timeline} invisible={invisible} />
        )}
        {timeline === 'favourites' && (
          <Timeline name={timeline} invisible={invisible} />
        )}
        {timeline === 'bookmarks' && (
          <Timeline name={timeline} invisible={invisible} />
        )}
        {timeline === 'search' && <SearchTimeline invisible={invisible} />}
        {timeline === 'urls' && <UrlSearchTimeline />}
        {timeline === undefined && <HowTo />}
      </Box>
    )
  })

export default StatusSelector
