import React from 'react'

import Box from '@mui/material/Box'
import { grey } from '@mui/material/colors'

export const ResponsiveIndicator: React.FC = () => {
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 1,
        left: 1,
        zIndex: 10000,
        display: 'flex',
        height: '1rem',
        width: '1.5rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: grey[800],
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'small',
        p: 2,
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>xs</Box>
      <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>sm</Box>
      <Box sx={{ display: { xs: 'none', md: 'block', lg: 'none' } }}>md</Box>
      <Box
        sx={{
          display: {
            xs: 'none',
            lg: 'block',
            xl: 'none',
          },
        }}
      >
        lg
      </Box>
      <Box
        sx={{
          display: {
            xs: 'none',
            xl: 'block',
          },
        }}
      >
        xl
      </Box>
    </Box>
  )
}
