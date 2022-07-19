import * as React from 'react'
import moment from 'moment'
import Box from '@mui/material/Box'
import { SxProps, Theme } from '@mui/material/styles'

export interface TimestampProps {
  value: string
  className?: string
  sx?: SxProps<Theme>
}

const Timestamp: React.FC<TimestampProps> = ({ value, className, sx }) => {
  const date = moment(value)
  return (
    <Box className={className} sx={sx}>
      {date.format('YYYY-MM-DD HH:mm:ss')}
    </Box>
  )
}

export default Timestamp
