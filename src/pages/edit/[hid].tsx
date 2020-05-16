import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import StatusSelector from '../../components/editor/StatusSelector';
import EditStatus from '../../components/editor/EditStatus';
import PostInfo from '../../components/editor/PostInfo';
import head from '../../utils/head'
import { fetchPost } from '../../utils/hage'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import CircularProgress from '@material-ui/core/CircularProgress'
import NextError from 'next/error'
import { useEditor } from '../../stores'

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

const EditPage = () => {
  const router = useRouter()
  const classes = useStyles({});
  const [loading, setLoading] = React.useState(true)
  const [code, setCode] = React.useState<number>()
  const editor = useEditor();


  const hid = head(router.query.hid)
  React.useEffect(() => {
    let unmounted = false
    if (!hid) return
    fetchPost(hid)
      .then((result) => {
        if (!unmounted) {
          if (result.status === 200) {
            result.json().then((data) => {
              editor.setId(hid)
              editor.setTitle(data.data.title)
              editor.setDescription(data.data.description)
              editor.bulkAdd(data.data.data)
              editor.setVisibility(data.data.visibility)
              setCode(200)
              setLoading(false)
            })
          } else {
            setLoading(false)
            setCode(result.status)
          }
        }
      })
      .catch((err) => {
        setCode(500)
        setLoading(false)
      })
    return () => {
      unmounted = true
    }
  }, [hid])

  return (
    <div>
      <Header />
      <Container className={classes.container}>
        {loading && <CircularProgress />}
        {!loading && code === 404 && <NextError statusCode={404} />}
        {!loading && code === 200 && <Content />}
      </Container>
    </div>
  )
};

const Content: React.FC = () => {
  const classes = useStyles({});

  return (
    <Grid container spacing={2} className={classes.gridContainer}>
      <Grid item xs={4} className={classes.gridColumn}>
        <StatusSelector/>
      </Grid>
      <Grid item xs={4} className={classes.gridColumn}>
        <EditStatus/>
      </Grid>
      <Grid item xs={4}>
        <PostInfo/>
      </Grid>
    </Grid>)
}

export default EditPage;