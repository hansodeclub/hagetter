import React from 'react'

import DeleteIcon from '@mui/icons-material/DeleteRounded'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import MultilineText from '@/components/MultilineText'
import { ItemActionCallback } from '@/components/pages/editor-beta/PostEditorBeta'

import { TextSize } from '@/features/posts/types'
import { THagetterItem } from '@/stores/hagetterItem'

export const TextItemMenu: React.FC<{
  item: THagetterItem
  onAction: ItemActionCallback
}> = ({ item, onAction }) => {
  return (
    <Box>
      <IconButton
        aria-label="delete"
        onClick={() => onAction && onAction(item, { type: 'delete' })}
        size="small"
        sx={{ color: '#888', border: '1px solid #aaa' }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

interface TextItemProps {
  text: string
  variant: TextSize
  color: string
  selected?: boolean
  onClick?: () => any
}

export const TextItem: React.FC<TextItemProps> = ({
  text,
  variant,
  color,
  selected,
  onClick,
}) => (
  <li style={{ display: 'inline', padding: 0, margin: 0 }}>
    <Typography
      variant={variant}
      onClick={onClick}
      sx={{
        margin: 0,
        padding: '5px 10px',
        backgroundColor: selected ? '#ffeeee' : '#ffffff',
        color: color,
      }}
    >
      <MultilineText text={text} />
    </Typography>
  </li>
)
