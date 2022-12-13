import React from 'react'

import { observer } from 'mobx-react-lite'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Stack } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

import Toot from '@/components/Toot/Toot'
import TextFormatSelector from '@/components/editor/TextFormatSelector'
import {
  ItemActionCallback,
  leftColumnWidth,
} from '@/components/pages/editor-beta/PostEditorBeta'
import TextEdit from '@/components/pages/editor-beta/edit-items/TextEdit'
import {
  DeleteItemButton,
  EditItemButton,
  MoveDownItemButton,
  MoveUpItemButton,
} from '@/components/pages/editor-beta/menus/Buttons'

import { Status } from '@/core/domains/post/Status'

import { useEditor } from '@/stores'
import { THagetterItem } from '@/stores/hagetterItem'

import { TextItem, TextItemMenu } from './TextItem'

export interface ItemProps {
  item: THagetterItem
  onClick?: (item: THagetterItem) => any
  preferOriginal?: boolean
  onAction?: ItemActionCallback
  isMobile?: boolean
}

const PopupMenu: React.FC<{ children?: React.ReactNode; show: boolean }> = ({
  children,
  show,
}) => (
  <Box sx={{ position: 'absolute', left: 0, top: 0 }}>{show && children}</Box>
)

const FormatEdit: React.FC<{ item: THagetterItem }> = observer(({ item }) => {
  const [size, setSize] = React.useState<string | false>(item.size)
  const [color, setColor] = React.useState(item.color)

  const onSizeChange = (size) => {
    setSize(size)
    item.setFormat(size)
  }

  const onColorChange = (color) => {
    setColor(color)
    item.setFormat(undefined, color)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ ml: 2, pt: 1, pb: 2 }}>
        <TextFormatSelector
          size={size}
          onSizeChange={onSizeChange}
          color={color}
          onColorChange={onColorChange}
        />
      </Box>
      <Box>
        <IconButton sx={{ ml: 3 }} size="small">
          <HighlightOffIcon
            fontSize="large"
            onClick={() => item.setEditMode(false)}
          />
        </IconButton>
      </Box>
    </Box>
  )
})

const Item: React.FC<ItemProps> = observer(
  ({ item, onClick, preferOriginal, onAction, isMobile }) => {
    const onChangeText = (item, text, size, color) => {
      item.setFormat(size, color)
      item.setText(text)
      item.setEditMode(false)
    }

    if (item.type === 'status') {
      const status: Status = item.data as Status
      return (
        <>
          <PopupMenu show={(item.showMenu || item.selected) && !isMobile}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <DeleteItemButton item={item} onAction={onAction} />
                <EditItemButton item={item} onAction={onAction} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <MoveUpItemButton item={item} onAction={onAction} />
                <MoveDownItemButton item={item} onAction={onAction} />
              </Stack>
            </Stack>
          </PopupMenu>
          <li style={{ display: 'inline' }}>
            {item.editMode && <FormatEdit item={item} />}
            <Toot
              variant={item.size}
              color={item.color}
              onClick={() => onClick(item)}
              selected={item.selected}
              status={status}
              preferOriginal={preferOriginal}
            />
          </li>
          <Box></Box>
        </>
      )
    } else if (item.type === 'text') {
      const textItem: any = item.data as any
      return (
        <>
          <PopupMenu show={(item.showMenu || item.selected) && !isMobile}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <DeleteItemButton item={item} onAction={onAction} />
                <EditItemButton item={item} onAction={onAction} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <MoveUpItemButton item={item} onAction={onAction} />
                <MoveDownItemButton item={item} onAction={onAction} />
              </Stack>
            </Stack>
          </PopupMenu>
          {item.editMode && (
            <TextEdit
              onSubmit={(text, size, color) => {
                onChangeText(item, text, size, color)
              }}
              onCancel={() => item.setEditMode(false)}
              initialSize={item.size}
              initialColor={item.color}
              initialText={textItem.text}
            />
          )}
          {!item.editMode && (
            <Box sx={{ position: 'relative' }}>
              <TextItem
                text={textItem.text}
                variant={item.size}
                color={item.color}
                selected={item.selected}
                onClick={() => onClick(item)}
              />
              {isMobile && (
                <Box sx={{ position: 'absolute', right: 5, top: 5 }}>
                  <EditItemButton item={item} onAction={onAction} />
                </Box>
              )}
            </Box>
          )}
        </>
      )
    } else {
      throw Error(`Unknown item type: ${item.type}`)
    }
  }
)

export default Item
