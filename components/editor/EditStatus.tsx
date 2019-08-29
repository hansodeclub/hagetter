import React from 'react';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FormatIcon from '@material-ui/icons/TextFormat';
import AddIcon from '@material-ui/icons/AddCommentRounded';
import SortIcon from '@material-ui/icons/FormatLineSpacingRounded';
import UpArrowIcon from '@material-ui/icons/ArrowUpwardRounded';
import DownArrowIcon from '@material-ui/icons/ArrowDownwardRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import TextFormatSelector from './TextFormatSelector';

import { observer, useEditor } from '../../stores';
import { THagetterItem } from '../../stores/hagetterItem';
import ItemList from '../matome/ItemList';

const useStyles = makeStyles(theme =>
  createStyles({
    gridContent: {
      position: 'relative',
      flexGrow: 1,
      boxSizing: 'border-box',
      marginTop: 5,
      marginBottom: 2,
      height: '100%',
      backgroundColor: 'white'
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
      boxSizing: 'border-box'
    },
    box: {
      border: '1px solid #ccc',
      borderRadius: 5,
      marginTop: 5,
      backgroundColor: '#fff'
    },
    boxInner: {
      margin: 5
    },
    tootSelector: {
      flexGrow: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      overflow: 'scroll'
    },
    buttonContainer: {
      display: 'flex',
      height: 50,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: 5
    },
    button: {
      margin: theme.spacing(1)
    },
    howToContainer: {
      border: '1px solid #ccc',
      borderRadius: 5,
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      flexGrow: 1,
      marginTop: 5,
      marginBottom: 2
    },
    howTo: {
      margin: theme.spacing(3),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      backgroundColor: '#f1f1f1'
    },
    howToText: {
      width: '100%',
      textAlign: 'center'
    },
    toot: {
      borderBottom: '1px solid #ccc'
    }
  })
);

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
  onSubmit: (text: string, size: string, color: string) => any;
}> = ({ onSubmit }) => {
  const classes = useStyles({});
  const [size, setSize] = React.useState('h3');
  const [color, setColor] = React.useState('#000');
  const [text, setText] = React.useState('');

  return (
    <div className={classes.boxInner}>
      <TextField
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        onChange={event => setText(event.target.value)}
      />
      <div className={classes.button}>
        <TextFormatSelector
          size={size}
          onSizeChange={setSize}
          color={color}
          onColorChange={setColor}
        />
      </div>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={() => onSubmit(text, size, color)}
      >
        追加
      </Button>
    </div>
  );
};

const FormatEdit: React.FC = observer(() => {
  const classes = useStyles({});
  const editor = useEditor();
  const [size, setSize] = React.useState<string | false>(false);
  const [color, setColor] = React.useState('#fff');

  const onSizeChange = size => {
    setSize(size);
    editor.setSelectedFormat(size);
  };

  const onColorChange = color => {
    setColor(color);
    editor.setSelectedFormat(undefined, color);
  };

  return (
    <div className={classes.boxInner}>
      <div className={classes.button}>
        <TextFormatSelector
          size={size}
          onSizeChange={onSizeChange}
          color={color}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  );
});

const HowTo: React.FC = () => {
  const classes = useStyles({});
  return (
    <div className={classes.howTo}>
      <p className={classes.howToText}>使い方</p>
      <ul>
        <li>時系列は上が古く下が新しくなるようにします。</li>
        <li>
          <SortIcon style={{ verticalAlign: 'middle' }} />
          で時系列順にソート出来ます
        </li>
      </ul>
    </div>
  );
};

const EditStatus: React.FC = observer(() => {
  const classes = useStyles({});
  const editor = useEditor();
  const [isTextEditMode, setTextEditMode] = React.useState(false);
  const [isFormatMode, setFormatMode] = React.useState(false);

  const onSelect = (item: THagetterItem) => {
    editor.toggleSelected(item.id);
    return false;
  };

  const onAddText = (text, size, color) => {
    editor.addText(text, size, color, editor.getAnchor());
    setTextEditMode(false);
  };

  return (
    <>
      <Paper elevation={0} className={classes.buttonContainer}>
        <IconButton
          onClick={() => {
            setTextEditMode(!isTextEditMode);
            setFormatMode(false);
          }}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setFormatMode(!isFormatMode);
            setTextEditMode(false);
          }}
        >
          <FormatIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            editor.moveItem('up');
          }}
        >
          <UpArrowIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            editor.moveItem('down');
          }}
        >
          <DownArrowIcon />
        </IconButton>
        <IconButton onClick={() => editor.sort()}>
          <SortIcon />
        </IconButton>
        <IconButton onClick={() => editor.removeSelectedItem()}>
          <DeleteIcon />
        </IconButton>
      </Paper>
      {isTextEditMode && (
        <Paper elevation={0} className={classes.box}>
          <TextEdit onSubmit={onAddText} />
        </Paper>
      )}
      {isFormatMode && (
        <Paper elevation={0} className={classes.box}>
          <FormatEdit />
        </Paper>
      )}
      <div className={classes.gridContent}>
        <div className={classes.gridInner}>
          <ItemList onSelect={onSelect} items={editor.items} />
          {editor.items.length === 0 && <HowTo />}
        </div>
      </div>
    </>
  );
});

export default EditStatus;
