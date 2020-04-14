import * as React from 'react';
import Drawer from '@material-ui/core/Drawer';

const Sidebar: React.FC = () => {
    return (
        <Drawer variant="permanent" anchor="right">
            This is sidebar!
        </Drawer>
    )
}

export default Sidebar;