import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import TextFormatSelector from '@/components/editor/TextFormatSelector'

export interface TextEditProps {
  initialSize?: string
  initialColor?: string
  initialText?: string
  onSubmit: (text: string, size: string, color: string) => any
  onCancel: () => any
}

const TextEdit: React.FC<TextEditProps> = ({
  onSubmit,
  onCancel,
  initialText,
  initialSize,
  initialColor,
}) => {
  const [size, setSize] = React.useState(initialSize ?? 'h3')
  const [color, setColor] = React.useState(initialColor ?? '#000')
  const [text, setText] = React.useState(initialText ?? '')

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <TextField
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Box sx={{ display: 'flex', mt: 1 }}>
        <Box>
          <TextFormatSelector
            size={size}
            onSizeChange={setSize}
            color={color}
            onColorChange={setColor}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onCancel()}
            sx={{ width: 110 }}
          >
            キャンセル
          </Button>
        </Box>
        <Box sx={{ ml: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit(text, size, color)}
            sx={{ width: 110 }}
            disableElevation
          >
            追加
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TextEdit
