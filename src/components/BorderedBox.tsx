import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

const boxProps = {
  bgcolor: '#ffffff',
  borderColor: '#cccccc',
  border: 1,
  borderRadius: 10
};

const MyBox: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box {...boxProps} {...props}>
    {children}
  </Box>
);

export default MyBox;
