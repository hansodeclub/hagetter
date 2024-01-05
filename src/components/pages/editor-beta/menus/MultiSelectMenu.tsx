import React from 'react'

import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'

import { TextFormatter } from '@/components/ui/TextFormatter'

import { observer, useEditor } from '@/stores'

export interface MultiSelectMenuProps {
  isMobile?: boolean
  color?: string
  size?: string
}

const MultiSelectMenu: React.FC<MultiSelectMenuProps> = observer(
  ({ isMobile, color, size }) => {
    const editor = useEditor()

    const onChange = ({ size, color }) => {
      if (size) {
        editor.setSelectedFormat(size)
      }

      if (color) {
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
          bottom: 56,
        }}
      >
        <Slide
          direction="up"
          in={editor.selectedCount > 0}
          mountOnEnter
          unmountOnExit
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
        </Slide>
      </Box>
    )
  }
)

export default MultiSelectMenu
