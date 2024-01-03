import React from 'react'

import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded'
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded'
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded'
import TButton from '@mui/icons-material/Title'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import Swatch from './Swatch'

export const defaultColors = [
  '#000000',
  '#B80000',
  '#DB3E00',
  '#FCCB00',
  '#008B02',
  '#006B76',
  '#1273DE',
  '#004DCF',
  '#5300EB',
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#C1E1C5',
  '#BEDADC',
  '#C4DEF6',
  '#BED3F3',
  '#D4C4FB',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffffff',
]

const toggleButtonStyle = (theme) => ({
  margin: '4px 3px',
  padding: '6px',
  border: 0,
  '&.Mui-disabled': {
    border: 0,
  },
  '&:not(:first-of-type)': {
    borderRadius: 0.5,
  },
  '&:first-of-type': {
    borderRadius: 0.5,
  },
})

const toggleButtonGroupStyles = {
  '& .MuiToggleButtonGroup-grouped': toggleButtonStyle,
}

const StyledDivider: React.FC = () => (
  <Divider orientation="vertical" flexItem sx={{ my: '8px' }} />
)

export interface ChangeEvent {
  size?: string
  color?: string
  bold?: boolean
  italic?: boolean
}

export interface TextFormatterProps {
  text: string
  selected?: boolean
  color?: string
  size?: string
  onUnselect?: () => void
  onChange: (event: ChangeEvent) => void
  onMove: (direction: 'up' | 'down') => void
  onRemove: () => void
}

const TextFormatter: React.FC<TextFormatterProps> = ({
  text,
  onUnselect,
  size,
  color,
  onChange,
  onMove,
  onRemove,
}) => {
  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxShadow: 5,
        borderRadius: '8px 8px 0 0',
        width: 340,
      }}
    >
      <Box sx={{ display: 'flex', fontSize: '11px' }}>
        <Box>{text}</Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box
          onClick={onUnselect}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          選択解除
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2,
          color: '#1565c0',
          alignItems: 'end',
        }}
      >
        <IconButton
          aria-label="delete selected item"
          size="small"
          sx={toggleButtonStyle}
          onClick={() => onRemove()}
        >
          <DeleteRoundedIcon />
        </IconButton>
        <StyledDivider />
        <IconButton
          aria-label="move up"
          size="small"
          sx={toggleButtonStyle}
          onClick={() => onMove('up')}
        >
          <ArrowCircleUpRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton
          aria-label="move down"
          size="small"
          sx={toggleButtonStyle}
          onClick={() => onMove('down')}
        >
          <ArrowCircleDownRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <StyledDivider />
        <ToggleButton value="bold" size="small" sx={toggleButtonStyle} disabled>
          <FormatBoldRoundedIcon />
        </ToggleButton>
        <ToggleButton
          value="italic"
          size="small"
          sx={toggleButtonStyle}
          disabled
        >
          <FormatItalicRoundedIcon />
        </ToggleButton>
        <StyledDivider />
        <ToggleButtonGroup
          size="small"
          value={size}
          exclusive
          sx={toggleButtonGroupStyles}
          onChange={(e, size) => onChange({ size })}
        >
          <ToggleButton key={1} value="h3">
            <TButton sx={{ fontSize: '24px' }} />
          </ToggleButton>
          <ToggleButton key={2} value="h6">
            <TButton sx={{ fontSize: '22px', px: '1px', mb: '-1px' }} />
          </ToggleButton>
          <ToggleButton key={3} value="body2">
            <TButton sx={{ fontSize: '20px', px: '2px', mb: '-2px' }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid container spacing={1} columns={7} sx={{ mt: 1 }}>
        {defaultColors.map((c, i) => (
          <Grid item xs={1} key={i}>
            <Swatch
              color={c}
              selected={color === c}
              onClick={() => onChange({ color: c })}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TextFormatter
