import React from 'react'

import { observer } from 'mobx-react-lite'

import { THagetterItem } from '@/stores/hagetterItem'

import Item from './Item'

export interface ItemListProps {
  items: THagetterItem[]
  onSelect: (item: THagetterItem) => boolean
  preferOriginal?: boolean
}

const ItemList: React.FC<ItemListProps> = observer(
  ({ items, onSelect, preferOriginal }) => {
    return (
      <div>
        {items.map((value, index) => (
          <Item
            key={value.id}
            onClick={onSelect}
            item={value}
            preferOriginal={preferOriginal}
          />
        ))}
      </div>
    )
  }
)

export default ItemList
