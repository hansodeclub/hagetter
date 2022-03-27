import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree'
import { Status } from '~/entities/Status'
import { HagetterItem} from '~/entities/HagetterPost'
import { TextItem } from './editorStore'

const sizeType = types.optional(types.union(
      types.literal('h1'),
      types.literal('h2'),
      types.literal('h3'),
      types.literal('h4'),
      types.literal('h5'),
      types.literal('h6'),
      types.literal('body2'),
      types.literal('inherit')), 'inherit')

// このままだとTypeGuardがきかないのでTextItemとStatusをunionで定義する
const HagetterItem = types.model('HagetterItem', {
    id: types.string,
    sortKey: types.number,
    selected: types.optional(types.boolean, false),
    anchor: types.maybeNull(types.string),
    type: types.union(types.literal('status'), types.literal('text')),
    size: types.optional(types.union(
      types.literal('h1'),
      types.literal('h2'),
      types.literal('h3'),
      types.literal('h4'),
      types.literal('h5'),
      types.literal('h6'),
      types.literal('body2'),
      types.literal('inherit')), 'inherit'),
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
    get postData(): HagetterItem {
      if (self.type === 'text') {
        return {
          id: self.id,
          type: self.type,
          size: self.size,
          color: self.color,
          data: self.data as TextItem
        }
      } else {
        return {
          id: self.id,
          type: self.type,
          size: self.size,
          color: self.color,
          data: self.data as Status
        }
      }
    },
  }))

export type THagetterItem = Instance<typeof HagetterItem>
export interface IHagetterItemIn extends SnapshotIn<typeof HagetterItem> {}
export interface IHagetterItemOut extends SnapshotOut<typeof HagetterItem> {}

export default HagetterItem
