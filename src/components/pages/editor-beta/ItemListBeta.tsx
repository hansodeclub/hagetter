import React from 'react'

import { observer } from 'mobx-react-lite'

import Box from '@mui/material/Box'

import InsertDivider from '@/components/pages/editor-beta/InsertDivider'
import {
  ItemActionCallback,
  leftColumnWidth,
} from '@/components/pages/editor-beta/PostEditorBeta'

import { THagetterItem } from '@/stores/hagetterItem'

import Item from './items/Item'

export interface ItemListProps {
  items: THagetterItem[]
  onSelect: (item: THagetterItem) => boolean
  onShowItemMenu: (item: THagetterItem, showMenu: boolean) => void
  onAction: ItemActionCallback
  preferOriginal?: boolean
}

const ItemList: React.FC<ItemListProps> = observer(
  ({ items, onSelect, onShowItemMenu, onAction, preferOriginal }) => {
    return (
      <Box>
        {items.map((item, index) => (
          <>
            <InsertDivider anchor={item.id} />
            <Box
              key={item.id}
              sx={{ paddingLeft: `${leftColumnWidth}px`, position: 'relative' }}
              onMouseEnter={() => onShowItemMenu(item, true)}
              onMouseLeave={() => onShowItemMenu(item, false)}
            >
              <Item
                item={item}
                onClick={onSelect}
                onAction={onAction}
                preferOriginal={preferOriginal}
              />
            </Box>
          </>
        ))}
        <InsertDivider anchor={undefined} />
      </Box>
    )
  }
)

export default ItemList
