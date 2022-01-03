import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { Theme } from '@mui/material/styles'

const boxProps = {
  bgcolor: '#ffffff',
  borderRadius: 1,
}

const BorderedBox: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    {...boxProps}
    {...props}
    sx={{ border: (theme: Theme) => theme.app.border }}
  >
    {children}
  </Box>
)

export default BorderedBox
