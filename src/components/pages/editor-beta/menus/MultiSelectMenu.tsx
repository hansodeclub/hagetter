import React from 'react'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import TextFormatSelector from '@/components/editor/TextFormatSelector'

import { observer, useEditor } from '@/stores'

export interface MultiSelectMenuProps {
  isMobile?: boolean
}

const MultiSelectMenu: React.FC<MultiSelectMenuProps> = observer(
  ({ isMobile }) => {
    const editor = useEditor()
    const [size, setSize] = React.useState<string>('h3')
    const [color, setColor] = React.useState('#000000')

    const onSizeChange = (size) => {
      setSize(size)
      editor.setSelectedFormat(size)
    }

    const onColorChange = (color) => {
      setColor(color)
      editor.setSelectedFormat(undefined, color)
    }
    return (
      <Box
        sx={{
          position: 'fixed',
          left: 'min(45%, 380px)',
          transform: 'translateX(-50%)',
          bottom: 72,
          width: isMobile ? '350px' : undefined,
          border: (theme) => theme.app.border,
          borderRadius: 1,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ fontSize: 'small', mx: 2, mt: 1 }}>
          {editor.selectedCount}個のアイテムを選択中
        </Box>
        <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
          <Box>
            <IconButton color="primary">
              <DeleteIcon onClick={() => editor.removeSelectedItem()} />
            </IconButton>
          </Box>
          <Box>
            <IconButton color="primary">
              <ArrowUpwardIcon
                fontSize="small"
                onClick={() => editor.moveSelectedItem('up')}
              />
            </IconButton>
          </Box>
          <Box>
            <IconButton color="primary" sx={{ mr: isMobile ? 0.5 : 2 }}>
              <ArrowDownwardIcon
                fontSize="small"
                onClick={() => editor.moveSelectedItem('down')}
              />
            </IconButton>
          </Box>
          <TextFormatSelector
            size={size}
            onSizeChange={onSizeChange}
            color={color}
            onColorChange={onColorChange}
          />
          <Box sx={{ mr: isMobile ? 0.5 : 2 }}>
            <Tooltip title="選択解除">
              <IconButton
                size="small"
                sx={{
                  ml: isMobile ? 1 : 5,
                  border: (theme) => theme.app.border,
                }}
              >
                <CloseIcon onClick={() => editor.resetSelect()} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    )
  }
)

export default MultiSelectMenu
