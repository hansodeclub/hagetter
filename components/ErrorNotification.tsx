import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { amber } from '@material-ui/core/colors';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useStore, observer } from '../stores';

const useStyle = makeStyles((theme: Theme) => ({
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const action = (
  <Button color="primary" size="small">
    報告する
  </Button>
);

const ErrorNotification = observer(() => {
  const rootStore = useStore();
  const [open, setOpen] = React.useState(false);
  const classes = useStyle({});
  React.useEffect(() => {
    if (rootStore.error) {
      setOpen(true);
    }
  }, [rootStore.error]);
  if (!rootStore.error) return null;
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
    >
      <SnackbarContent
        className={classes.warning}
        message={
          <span id="message-id" className={classes.message}>
            <ErrorIcon />
            {rootStore.error.message}
          </span>
        }
        action={action}
      />
    </Snackbar>
  );
});

export default ErrorNotification;
