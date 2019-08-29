import * as React from 'react';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import head from '../../../utils/head';
import NextError from 'next/error';
import {getUserPost} from '../../../utils/hage';
import {useStore} from '../../../stores';



const UserPost = () => {
  const app = useStore();
  const router = useRouter();
  const username = head(router.query.username);
  const [loading, setLoading] = React.useState(true);
  const [code, setCode] = React.useState<number>();
  const [item, setItem] = React.useState<any>();

  React.useEffect(() => {
    let unmounted = false;
    if(!username) return;
    getUserPost(username).then(result => {
      if (!unmounted) {
        console.log(result);
        setItem(result.data);
        setCode(result.status);
        setLoading(false);
      }
    }).catch(err => {
      app.notifyError(err);
      setLoading(false);
    });
    return () => {
      unmounted = true;
    };
  }, [username]);

  return (<div>
    <Header/>
    <Container>
      {loading && <CircularProgress/>}
      {!loading && code === 404 && <NextError statusCode={404}/>}
      {!loading && code === 200 && item && JSON.stringify(item) }
    </Container>
  </div>);
};

export default UserPost;