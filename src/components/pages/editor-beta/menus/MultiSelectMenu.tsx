import React from 'react'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { TextFormatter } from '@/components/ui/TextFormatter'

import { observer, useEditor } from '@/stores'

export interface MultiSelectMenuProps {
  isMobile?: boolean
}

const MultiSelectMenu: React.FC<MultiSelectMenuProps> = observer(
  ({ isMobile }) => {
    const editor = useEditor()
    const [size, setSize] = React.useState<string>('h3')
    const [color, setColor] = React.useState('#000000')

    const onChange = ({ size, color }) => {
      if (size) {
        setSize(size)
        editor.setSelectedFormat(size)
      }

      if (color) {
        setColor(color)
        editor.setSelectedFormat(undefined, color)
      }
    }

    const onMove = (direction: 'up' | 'down') => {
      editor.moveSelectedItem(direction)
    }

    return (
      <Box
        sx={{
          position: 'fixed',
          left: 'min(45%, 380px)',
          transform: 'translateX(-50%)',
          bottom: 72,
        }}
      >
        <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
          <TextFormatter
            text={`${editor.selectedCount}個のアイテムを選択中`}
            size={size}
            color={color}
            onChange={onChange}
            onMove={onMove}
            onUnselect={() => editor.resetSelect()}
            onRemove={() => editor.removeSelectedItem()}
          />
        </Box>
      </Box>
    )
  }
)

export default MultiSelectMenu
