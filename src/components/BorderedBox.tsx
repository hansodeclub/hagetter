import React from 'react'

import Box, { BoxProps } from '@mui/material/Box'
import { Theme } from '@mui/material/styles'

const boxProps = {
  bgcolor: '#ffffff',
  borderRadius: 1,
  overflow: 'hidden',
}

const BorderedBox: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    {...boxProps}
    {...props}
    sx={{ padding: 0, border: (theme: Theme) => theme.app.border }}
  >
    {children}
  </Box>
)

export default BorderedBox
