import React from 'react'

import TitleIcon from '@mui/icons-material/Title'
import { Fade } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import { leftColumnWidth } from '@/components/pages/editor-beta/PostEditorBeta'

import { observer, useEditor } from '@/stores'

import TextEdit from './edit-items/TextEdit'

export interface InsertDividerProps {
  anchor?: string
}

export const InsertDivider: React.FC<InsertDividerProps> = observer(
  ({ anchor }) => {
    const editor = useEditor()
    const [mouseOver, setMouseOver] = React.useState(false)
    const [insertTextMode, setInsertTextMode] = React.useState(false)

    const onInsertText = (text, size, color) => {
      editor.addText(text, size, color, anchor)
      setInsertTextMode(false)
      setMouseOver(false)
    }

    if (insertTextMode) {
      return (
        <Box sx={{ marginLeft: `${leftColumnWidth}px` }}>
          <TextEdit
            onSubmit={onInsertText}
            onCancel={() => setInsertTextMode(false)}
          />
        </Box>
      )
    }

    return (
      <Box
        sx={{
          height: '32px',
          cursor: 'pointer',
          position: 'relative',
          marginLeft: `${leftColumnWidth}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover:before': {
            content: "''",
            position: 'absolute',
            top: '50%',
            left: '0',
            borderTop: '1px solid rgba(0,0,0,0.2)',
            width: '100%',
            transform: 'translateY(-50%)',
            animation: 'fadein 0.3s fade-out forwards',
          },
          '@keyframes fadein': {
            '0%': {
              opacity: 0,
            },
            '100%': {
              opacity: 1,
            },
          },
        }}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        <Fade in={mouseOver}>
          <IconButton
            sx={{
              border: '1px solid #888',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            size="small"
            onClick={() => setInsertTextMode(true)}
          >
            <TitleIcon fontSize="small" />
          </IconButton>
        </Fade>
      </Box>
    )
  }
)

export default InsertDivider
