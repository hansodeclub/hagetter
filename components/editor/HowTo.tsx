import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  howTo: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: '#f1f1f1'
  },
  howToText: {
    width: '100%',
    textAlign: 'center'
  }
}));

const HowTo: React.FC<{ className?: string }> = ({ children, className }) => {
  const classes = useStyles({});

  return (
    <div className={clsx(classes.howTo, className)}>
      <p className={classes.howToText}>使い方</p>
      <ul>{children}</ul>
    </div>
  );
};

export const Tips: React.FC = ({ children }) => <li>{children}</li>;

export default HowTo;
