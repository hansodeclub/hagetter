import { cast, types } from 'mobx-state-tree'
import { Status } from '../utils/mastodon/types'
import moment from 'moment'
import stable from 'stable'
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
    addStatus(status: Status, anchor?: string) {
      if (self.items.find((item) => item.id === status.id)) {
        return // duplicated item
      }
      const index = anchor
        ? self.items.findIndex((item) => item.id === anchor)
        : self.items.length

      const account2 = { ...status.account, note: '' }
      const status2 = { ...status, account: account2 }

      self.items.splice(index === -1 ? 0 : index, 0, {
        id: status2.id,
        sortKey: moment(status2.created_at).valueOf(),
        selected: false,
        type: 'status',
        data: status2,
      })
    },
    addText(text: string, size: string, color: string, anchor?: string) {
      const anchorIndex = anchor
        ? self.items.findIndex((item) => item.id === anchor)
        : -1
      const sortKey =
        anchorIndex !== -1 ? self.items[anchorIndex].sortKey - 1 : generateId()
      self.items.splice(
        anchorIndex !== -1 ? anchorIndex : self.items.length,
        0,
        {
          id: generateId().toString(),
          sortKey: sortKey,
          selected: false,
          type: 'text',
          size: size,
          color: color,
          data: {
            text: text,
          },
        }
      )
    },
    setSelectedFormat(size?: string, color?: string) {
      self.items.forEach((item) => {
        if (item.selected) {
          if (size) item.size = size
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
    toggleSelected(id: string) {
      const item = self.items.find((item) => item.id === id)
      if (item) {
        item.toggleSelected()
      }
    },
    removeSelectedItem() {
      self.items = cast(self.items.filter((item) => !item.selected))
    },
    /**
     * 選択したStatusを上下に一つ移動する(複数選択も可)
     * @param direction 動かす方向
     */
    moveItem(direction: 'up' | 'down') {
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
  .views((self) => ({
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
  }))

export default EditorStore
