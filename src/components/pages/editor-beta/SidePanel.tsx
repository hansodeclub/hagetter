import React from 'react'

import { Collapse } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'

import SideContent, {
  TimelineName,
} from '@/components/pages/editor-beta/SideContent'

import StatusSelectorBeta from './StatusSelectorBeta'

export interface SidePanelProps {
  timeline: TimelineName
  onChangeTimeline: (timeline: TimelineName) => void
  invisible?: boolean
  toggleInvisible?: () => void
  isTablet?: boolean
}

export const SidePanel: React.FC<SidePanelProps> = ({
  timeline,
  onChangeTimeline,
  invisible,
  toggleInvisible,
  isTablet,
}) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        maxWidth: 48 + 360,
        height: '100%',
        border: '1px solid #ccc',
        borderRight: isTablet ? 0 : '1px solid #ccc',
        backgroundColor: '#fff',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        borderTopRightRadius: isTablet ? 0 : '8px',
        borderBottomRightRadius: isTablet ? 0 : '8px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flexBasis: '48px' }}>
        <SideContent
          timeline={timeline}
          setTimeline={(timeline) => {
            onChangeTimeline(timeline)
          }}
          toggleDrawer={toggleInvisible}
          showTimeline={!invisible}
          showBurgerMenu={false}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: '100%',
            backgroundColor: 'white',
            width: invisible ? 0 : 360,
          }}
          style={{
            transition: isTablet ? 'width .2s ease-out' : undefined,
          }}
        >
          <StatusSelectorBeta timeline={timeline} invisible={invisible} />
        </Box>
      </Box>
    </Paper>
  )
}

export default SidePanel
