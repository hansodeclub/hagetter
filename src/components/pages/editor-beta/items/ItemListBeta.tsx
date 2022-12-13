import React from 'react'

import { observer } from 'mobx-react-lite'

import Box from '@mui/material/Box'

import {
  ItemActionCallback,
  leftColumnWidth,
} from '@/components/pages/editor-beta/PostEditorBeta'
import InsertDivider from '@/components/pages/editor-beta/items/InsertDivider'

import { THagetterItem } from '@/stores/hagetterItem'

import Item from './Item'

export interface ItemListProps {
  items: THagetterItem[]
  onSelect: (item: THagetterItem) => boolean
  onShowItemMenu: (item: THagetterItem, showMenu: boolean) => void
  onAction: ItemActionCallback
  preferOriginal?: boolean
  isMobile?: boolean
}

const ItemList: React.FC<ItemListProps> = observer(
  ({ items, onSelect, onShowItemMenu, onAction, preferOriginal, isMobile }) => {
    return (
      <Box>
        {items.map((item, index) => (
          <>
            <InsertDivider anchor={item.id} isMobile={isMobile} />
            <Box
              key={item.id}
              sx={{
                paddingLeft: isMobile ? 0 : `${leftColumnWidth}px`,
                position: 'relative',
              }}
              onMouseOver={
                isMobile ? undefined : () => onShowItemMenu(item, true)
              }
              onMouseOut={
                isMobile ? undefined : () => onShowItemMenu(item, false)
              }
            >
              {isMobile}
              <Item
                item={item}
                onClick={onSelect}
                onAction={onAction}
                preferOriginal={preferOriginal}
                isMobile={isMobile}
              />
            </Box>
          </>
        ))}
        <InsertDivider anchor={undefined} isMobile={isMobile} />
      </Box>
    )
  }
)

export default ItemList
