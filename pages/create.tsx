import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import StatusSelector from '../components/editor/StatusSelector';
import EditStatus from '../components/editor/EditStatus';
import PostInfo from '../components/editor/PostInfo';


const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      minWidth: 1000
    },
    gridContainer: {
      height: '100vh',
      overflow: 'hidden',
      paddingTop: 10,
      boxSizing: 'border-box'
    },
    gridColumn: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
  })
);

const Create = () => {
  const classes = useStyles({});

  return (
    <Container className={classes.container}>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={4} className={classes.gridColumn}>
          <StatusSelector />
        </Grid>
        <Grid item xs={4} className={classes.gridColumn}>
          <EditStatus />
        </Grid>
        <Grid item xs={4}>
          <PostInfo />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Create;
