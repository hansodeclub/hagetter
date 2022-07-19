import React from 'react'

import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import FormatIcon from '@mui/icons-material/TextFormat'
import AddIcon from '@mui/icons-material/AddCommentRounded'
import SortIcon from '@mui/icons-material/FormatLineSpacingRounded'
import UpArrowIcon from '@mui/icons-material/ArrowUpwardRounded'
import DownArrowIcon from '@mui/icons-material/ArrowDownwardRounded'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import styles from './editorStyles'

import TextFormatSelector from './TextFormatSelector'

import { useEditor } from '@/stores'
import { THagetterItem } from '@/stores/hagetterItem'
import { observer } from 'mobx-react-lite'

import ItemList from '../matome/ItemList'

/*
const styles: { [key: string]: SxProps<Theme> } = {
  gridContent: {
    position: 'relative',
    flexGrow: 1,
    boxSizing: 'border-box',
    marginTop: 5,
    marginBottom: 2,
    height: '100%',
    backgroundColor: 'white',
  },
  gridInner: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'scroll',
    border: '1px solid #ccc',
    borderRadius: 5,
    boxSizing: 'border-box',
  },
  box: {
    border: '1px solid #ccc',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  boxInner: {
    margin: 5,
  },
  tootSelector: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'scroll',
  },
  buttonContainer: {
    display: 'flex',
    height: 50,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: 5,
  },
  button: {
    margin: 1,
  },
  howToContainer: {
    border: '1px solid #ccc',
    borderRadius: 5,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    flexGrow: 1,
    marginTop: 5,
    marginBottom: 2,
  },
  howTo: {
    margin: 3,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#f1f1f1',
  },
  howToText: {
    width: '100%',
    textAlign: 'center',
  },
  toot: {
    borderBottom: '1px solid #ccc',
  },
} */

/*


const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "white",
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});


const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/*
const SortableElem = SortableElement(({ value, onClick }: { value: THagetterItem | undefined, onClick: (item: THagetterItem) => boolean }) => {
  if (!value) return <p>???</p>;


  if (value.type === 'status') {
    return <li style={{ display: 'inline' }}><Toot onClick={() => onClick(value)} selected={value.selected} status={value.data} /></li>
  } else {
    return <li style={{ display: 'inline' }}><h1 onClick={() => onClick(value)}>{value.data.text}</h1></li>
  }
});

const SortableList = SortableContainer(({ items, onSelect }: { items: THagetterItem[], onSelect: (item: THagetterItem) => boolean }) => {
  return (
    <div>
      {
        items.map((value, index) => (
          <SortableElem onClick={onSelect} key={`item-${index}`} index={index} value={value} />
        ))
      }
    </div>
  )
});*/

//{item.type === 'text' && <div><h1 className={item.data.color}>{item.data.text}</h1></div>}

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
                editor.moveItem('up')
              }}
              sx={{ padding: '12px' }}
            >
              <UpArrowIcon />
            </IconButton>
          </Grid>
          <Grid xs={2}>
            <IconButton
              onClick={() => {
                editor.moveItem('down')
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
            <ItemList onSelect={onSelect} items={editor.items} />
            {editor.items.length === 0 && <HowTo />}
          </Box>
        </Box>
      </Box>
    </>
  )
})

export default PostEditor
