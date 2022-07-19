import * as React from 'react'
import Drawer from '@mui/material/Drawer'

const Sidebar: React.FC = () => {
  return (
    <Drawer variant="permanent" anchor="right">
      This is sidebar!
    </Drawer>
  )
}

export default Sidebar
