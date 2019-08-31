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
import  {deletePost} from '../../../utils/hage';
import moment from 'moment';

const UserPost = () => {
  const app = useStore();
  const router = useRouter();
  const username = head(router.query.username);
  const [loading, setLoading] = React.useState(true);
  const [invoke, setInvoke] = React.useState(false);
  const [code, setCode] = React.useState<number>();
  const [items, setItems] = React.useState<any>();

  React.useEffect(() => {
    let unmounted = false;
    if(!username) return;
    getUserPost(username).then(result => {
      if (!unmounted) {
        setItems(result.data.items);
        setLoading(false);
      }
    }).catch(err => {
      app.notifyError(err);
      setLoading(false);
    });
    return () => {
      unmounted = true;
    };
  }, [username, invoke]);

  const onDeletePost = async (id:string) => {
    if(window.confirm("削除しますか?")) {
      try {
        await deletePost(id);
        setInvoke(!invoke); // TODO: yabai
      } catch(err) {
        app.notifyError(err);
      }
    }
  }

  return (<div>
    <Header/>
    <Container>
      {loading && <CircularProgress/>}
      {!loading && <div>
        <h4>あなたのまとめ一覧</h4>
        <ul>
          {!loading && items && items.map(item =>
            <li><a href={`/hi/${item.id}`}>{item.title}</a>{item.visibility==='unlisted'&&'(未収載)'}  {moment(item.created_at).format('YYYY-MM-DD HH:MM:SS')}
              <button onClick={() => onDeletePost(item.id)}>削除</button></li>)}
        </ul>
      </div>}
    </Container>
  </div>);
};

export default UserPost;