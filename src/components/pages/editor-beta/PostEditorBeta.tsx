import React from 'react'

import { observer } from 'mobx-react-lite'

import SortIcon from '@mui/icons-material/FormatLineSpacingRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import TextFormatSelector from '@/components/editor/TextFormatSelector'
import styles from '@/components/editor/editorStyles'

import { useEditor } from '@/stores'
import { THagetterItem } from '@/stores/hagetterItem'

import ItemList from './items/ItemListBeta'

const FormatEdit: React.FC = observer(() => {
  const editor = useEditor()
  const [size, setSize] = React.useState<string | false>(false)
  const [color, setColor] = React.useState('#fff')

  const onSizeChange = (size) => {
    setSize(size)
    editor.setSelectedFormat(size)
  }

  const onColorChange = (color) => {
    setColor(color)
    editor.setSelectedFormat(undefined, color)
  }

  return (
    <Box sx={styles.boxInner}>
      <Box sx={styles.button}>
        <TextFormatSelector
          size={size}
          onSizeChange={onSizeChange}
          color={color}
          onColorChange={onColorChange}
        />
      </Box>
    </Box>
  )
})

const HowTo: React.FC = () => {
  return (
    <Box sx={styles.howTo}>
      <Typography sx={styles.howToTitle}>使い方</Typography>
      <ul>
        <li>ポストを追加するには右のタイムラインをクリックします</li>
        <li>時系列は上が古く下が新しくなるようにします。</li>
        <li>下部のメニューから時系列順にソート出来ます</li>
      </ul>
    </Box>
  )
}

export type ItemAction = {
  type: 'delete' | 'moveUp' | 'moveDown' | 'edit'
}

export type ItemActionCallback = (
  item: THagetterItem,
  action: ItemAction
) => any

export const leftColumnWidth = 80

export interface PostEditorProps {
  isMobile?: boolean
}

const PostEditor: React.FC<PostEditorProps> = observer(({ isMobile }) => {
  const editor = useEditor()

  const onSelect = (item: THagetterItem) => {
    editor.toggleSelected(item.id)
    return false
  }

  const onShowItemMenu = (item: THagetterItem, showMenu: boolean) => {
    editor.setShowMenu(item.id, showMenu)
  }

  const onItemAction = (item: THagetterItem, action: ItemAction) => {
    switch (action.type) {
      case 'moveUp':
        editor.moveItem(item.id, 'up')
        break
      case 'moveDown':
        editor.moveItem(item.id, 'down')
        break
      case 'delete':
        editor.removeItem(item.id)
        break
      case 'edit':
        editor.setEdit(item.id, true)
        break
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            width: leftColumnWidth,
            justifyContent: 'center',
            verticalAlign: 'middle',
            fontWeight: 700,
          }}
        >
          <p>タイトル</p>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            style={{ backgroundColor: 'white' }}
            defaultValue={editor.title}
            onChange={(event) => editor.setTitle(event.target.value)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          mt: 1,
        }}
      >
        <Box
          sx={{
            width: leftColumnWidth,
            justifyContent: 'center',
            verticalAlign: 'middle',
            fontWeight: 700,
          }}
        >
          説明文
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            multiline
            fullWidth
            rows={4}
            style={{ backgroundColor: 'white' }}
            defaultValue={editor.description}
            onChange={(event) => editor.setDescription(event.target.value)}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <ItemList
          onSelect={onSelect}
          items={editor.items}
          onShowItemMenu={onShowItemMenu}
          onAction={onItemAction}
          preferOriginal
          isMobile={isMobile}
        />
        {editor.items.length === 0 && <HowTo />}
      </Box>
    </>
  )
})

export default PostEditor
