import { cast, types } from 'mobx-state-tree'
import moment from 'moment'
import stable from 'stable'

import { Status, TextSize, isTextSize } from '@/features/posts/types'

import HagetterItem from './hagetterItem'

/*
export interface HagetterItem {
    id: string
    sortKey: number
    selected: boolean
    anchor?: string
    type: 'status' | 'text'
    data: any
}*/

export interface TextItem {
  text: string
}

const generateId = () => {
  return Date.now()
}

const EditorStore = types
  .model('EditorModel', {
    hid: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    visibility: types.optional(types.string, 'public'),
    items: types.optional(types.array(HagetterItem), []),
  })
  .actions((self) => ({
    // 一番下の選択済みアイテムを取得する(新規アイテム挿入は一番下に入れる)
    getAnchor(): string | undefined {
      for (let i = self.items.length - 1; i >= 0; i--) {
        if (self.items[i].selected) return self.items[i].id
      }
      return undefined
      //const item = self.items.find(item => item.selected);
      //return item ? item.id : undefined;
    },
    reset() {
      self.title = ''
      self.description = ''
      self.items = cast([])
      self.visibility = 'public'
    },
    setId(hid: string) {
      self.hid = hid
    },
    setTitle(title: string) {
      self.title = title
    },
    setDescription(description: string) {
      self.description = description
    },
    setVisibility(visibility: 'unlisted' | 'public') {
      self.visibility = visibility
    },
    addStatus(status: Status, anchor?: string, size?: string, color?: string) {
      if (size && !isTextSize(size)) throw Error('Invalid text size')

      if (self.items.find((item) => item.id === status.id)) {
        return // duplicated item
      }

      const index = anchor
        ? self.items.findIndex((item) => item.id === anchor)
        : self.items.length

      self.items.splice(index === -1 ? 0 : index, 0, {
        id: status.id,
        sortKey: moment(status.createdAt).valueOf(),
        selected: false,
        type: 'status',
        data: status,
        size: size as TextSize | undefined,
        color,
      })
    },
    addText(text: string, size: string, color: string, anchor?: string) {
      if (size && !isTextSize(size)) throw Error('Invalid text size')

      const anchorIndex = anchor
        ? self.items.findIndex((item) => item.id === anchor)
        : -1

      const id = generateId()

      const sortKey =
        anchorIndex !== -1 ? self.items[anchorIndex].sortKey - 1 : id

      self.items.splice(
        anchorIndex !== -1 ? anchorIndex : self.items.length,
        0,
        {
          id: id.toString(),
          sortKey: sortKey,
          selected: false,
          type: 'text',
          size: size as TextSize | undefined,
          color: color,
          data: {
            text: text,
          },
        }
      )
    },
    setFormat(id: string, size?: string, color?: string) {
      if (size && !isTextSize(size)) throw Error('Invalid text size')

      self.items.forEach((item) => {
        if (item.id === id) {
          if (size) item.size = size as TextSize
          if (color) item.color = color
        }
      })
    },
    setSelectedFormat(size?: string, color?: string) {
      if (size && !isTextSize(size)) throw Error('Invalid text size')

      self.items.forEach((item) => {
        if (item.selected) {
          if (size) item.size = size as TextSize
          if (color) item.color = color
        }
      })
    },
    setSelected(id: string, selected: boolean = true) {
      const item = self.items.find((item) => item.id === id)
      if (item) {
        item.setSelected(selected)
      }
    },
    setShowMenu(id: string, showMenu: boolean) {
      const item = self.items.find((item) => item.id === id)
      if (item) {
        item.setShowMenu(showMenu)
      }
    },
    toggleSelected(id: string) {
      const item = self.items.find((item) => item.id === id)
      if (item) {
        item.toggleSelected()
      }
    },
    resetSelect() {
      self.items.forEach((item) => {
        if (item.selected) item.setSelected(false)
      })
    },
    removeSelectedItem() {
      self.items = cast(self.items.filter((item) => !item.selected))
    },
    removeItem(id: string) {
      self.items = cast(self.items.filter((item) => item.id !== id))
    },
    setEdit(id: string, editMode: boolean) {
      const item = self.items.find((item) => item.id === id)
      if (item) {
        item.setEditMode(editMode)
      }
    },
    moveItem(id: string, direction: 'up' | 'down') {
      const index = self.items.findIndex((item) => item.id === id)
      if (index === -1) return

      const items = Array.from(self.items)

      const item = items[index]
      const targetIndex =
        direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : -1

      if (targetIndex === -1) return

      items.splice(index, 1)
      items.splice(targetIndex, 0, item)
      self.items = cast(items)
    },
    /**
     * 選択したStatusを上下に一つ移動する(複数選択も可)
     * @param direction 動かす方向
     */
    moveSelectedItem(direction: 'up' | 'down') {
      if (self.items.length <= 1) {
        return
      }
      if (
        (direction === 'up' && self.items[0].selected) ||
        (direction === 'down' && self.items[self.items.length - 1].selected)
      )
        return

      const start = direction === 'up' ? 1 : self.items.length - 2
      const end = direction === 'up' ? self.items.length : -1
      const step = direction === 'up' ? 1 : -1
      const items = Array.from(self.items)
      for (let i = start; i != end; i += step) {
        if (items[i].selected && !items[i - step].selected) {
          const tmp = self.items[i]
          items[i] = items[i - step]
          items[i - step] = tmp
        }
      }
      self.items = cast(items)
    },
    sort(by: string = 'date') {
      // TODO: 日付以外のソートにも対応する
      // sortKeyは重複するので安定ソート
      self.items = cast(stable(self.items, (a, b) => a.sortKey > b.sortKey))
    },
  }))
  .actions((self) => ({
    bulkAdd(items: any[]) {
      items.forEach((item) => {
        if (item.type === 'status') {
          self.addStatus(
            item.data as Status,
            item.anchor,
            item.size,
            item.color
          )
        } else if (item.type === 'text') {
          self.addText(item.data.text, item.size, item.color)
        }
      })
    },
  }))
  .views((self) => ({
    get itemIds() {
      return new Set<string>(self.items.map((item) => item.id))
    },
    get editing(): boolean {
      return (
        self.items.length > 0 || self.title !== '' || self.description !== ''
      )
    },
    get hasPrivateStatus() {
      return (
        undefined !==
        self.items.find(
          (item) =>
            item.type === 'status' &&
            ((item.data as Status).visibility === 'private' ||
              (item.data as Status).visibility === 'direct')
        )
      )
    },
    get selectedCount() {
      return self.items.filter((item) => item.selected).length
    },
    get selectedItems() {
      return self.items.filter((item) => item.selected)
    },
    /**
     * 選択されているStatusのフォーマットを返す
     * 複数選択されている場合は、colorとsizeは全て同じ値である時のみ返す
     */
    get selectedItemsFormat() {
      const selectedItems = self.items.filter((item) => item.selected)
      if (selectedItems.length === 0) {
        return {
          color: undefined,
          size: undefined,
        }
      }
      const firstColor = selectedItems[0].color
      const firstSize = selectedItems[0].size

      return {
        color: selectedItems.every((item) => item.color === firstColor)
          ? firstColor
          : undefined,
        size: selectedItems.every((item) => item.size === firstSize)
          ? firstSize
          : undefined,
      }
    },
  }))

export default EditorStore
