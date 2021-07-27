import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree'
import { Status } from '~/entities/Mastodon'
import { TextItem } from './editorStore'

// このままだとTypeGuardがきかないのでTextItemとStatusをunionで定義する
const HagetterItem = types
  .model('HagetterItem', {
    id: types.string,
    sortKey: types.number,
    selected: types.optional(types.boolean, false),
    anchor: types.maybeNull(types.string),
    type: types.string,
    size: types.optional(types.string, 'inherit'),
    color: types.optional(types.string, '#000000'),
    data: types.frozen<TextItem | Status>(),
  })
  .actions((self) => ({
    setSelected(selected: boolean) {
      self.selected = selected
    },
    toggleSelected() {
      self.selected = !self.selected
    },
  }))
  .views((self) => ({
    get postData() {
      return {
        id: self.id,
        type: self.type,
        size: self.size,
        color: self.color,
        data: self.data,
      }
    },
  }))

export type THagetterItem = Instance<typeof HagetterItem>
export interface IHagetterItemIn extends SnapshotIn<typeof HagetterItem> {}
export interface IHagetterItemOut extends SnapshotOut<typeof HagetterItem> {}

export default HagetterItem
