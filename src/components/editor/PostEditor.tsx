import React from 'react'

import { observer } from 'mobx-react-lite'

import AddIcon from '@mui/icons-material/AddCommentRounded'
import DownArrowIcon from '@mui/icons-material/ArrowDownwardRounded'
import UpArrowIcon from '@mui/icons-material/ArrowUpwardRounded'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import SortIcon from '@mui/icons-material/FormatLineSpacingRounded'
import FormatIcon from '@mui/icons-material/TextFormat'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useEditor } from '@/stores'
import { THagetterItem } from '@/stores/hagetterItem'

import ItemList from '../matome/ItemList'
import TextFormatSelector from './TextFormatSelector'
import styles from './editorStyles'

const TextEdit: React.FC<{
  onSubmit: (text: string, size: string, color: string) => any
}> = ({ onSubmit }) => {
  const [size, setSize] = React.useState('h3')
  const [color, setColor] = React.useState('#000')
  const [text, setText] = React.useState('')

  return (
    <Box>
      <TextField
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        onChange={(event) => setText(event.target.value)}
      />
      <Box sx={styles.button}>
        <TextFormatSelector
          size={size}
          onSizeChange={setSize}
          color={color}
          onColorChange={setColor}
        />
      </Box>
      <Button
        variant="outlined"
        color="primary"
        sx={styles.button}
        onClick={() => onSubmit(text, size, color)}
      >
        追加
      </Button>
    </Box>
  )
}

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
        <li>時系列は上が古く下が新しくなるようにします。</li>
        <li>
          <SortIcon style={{ verticalAlign: 'middle' }} />
          で時系列順にソート出来ます
        </li>
      </ul>
    </Box>
  )
}

const PostEditor: React.FC = observer(() => {
  const editor = useEditor()
  const [isTextEditMode, setTextEditMode] = React.useState(false)
  const [isFormatMode, setFormatMode] = React.useState(false)

  const onSelect = (item: THagetterItem) => {
    editor.toggleSelected(item.id)
    return false
  }

  const onAddText = (text, size, color) => {
    editor.addText(text, size, color, editor.getAnchor())
    setTextEditMode(false)
  }

  return (
    <>
      <Paper elevation={0} sx={styles.tabs}>
        <Grid container>
          <Grid xs={2}>
            <IconButton
              onClick={() => {
                setTextEditMode(!isTextEditMode)
                setFormatMode(false)
              }}
              sx={{ padding: '12px' }}
            >
              <AddIcon />
            </IconButton>
          </Grid>
          <Grid xs={2}>
            <IconButton
              onClick={() => {
                setFormatMode(!isFormatMode)
                setTextEditMode(false)
              }}
              sx={{ padding: '12px' }}
            >
              <FormatIcon />
            </IconButton>
          </Grid>
          <Grid xs={2}>
            <IconButton
              onClick={() => {
                editor.moveSelectedItem('up')
              }}
              sx={{ padding: '12px' }}
            >
              <UpArrowIcon />
            </IconButton>
          </Grid>
          <Grid xs={2}>
            <IconButton
              onClick={() => {
                editor.moveSelectedItem('down')
              }}
              sx={{ padding: '12px' }}
            >
              <DownArrowIcon />
            </IconButton>
          </Grid>
          <Grid xs={2}>
            <IconButton onClick={() => editor.sort()} sx={{ padding: '12px' }}>
              <SortIcon />
            </IconButton>
          </Grid>
          <Grid xs={2}>
            <IconButton
              onClick={() => editor.removeSelectedItem()}
              sx={{ padding: '12px' }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      {isTextEditMode && (
        <Paper elevation={0} sx={styles.headerContent}>
          <TextEdit onSubmit={onAddText} />
        </Paper>
      )}
      {isFormatMode && (
        <Paper elevation={0} sx={styles.headerContent}>
          <FormatEdit />
        </Paper>
      )}
      <Box sx={styles.outer}>
        <Box sx={styles.content}>
          <Box sx={styles.tootSelector}>
            <ItemList onSelect={onSelect} items={editor.items} preferOriginal />
            {editor.items.length === 0 && <HowTo />}
          </Box>
        </Box>
      </Box>
    </>
  )
})

export default PostEditor
