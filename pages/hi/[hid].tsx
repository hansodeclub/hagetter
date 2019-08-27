import * as React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../App.scss';
import head from '../../utils/head';
import NextError from 'next/error';
import {TextItem} from '../../components/matome/Item';
import Toot from '../../components/Toot/Toot';
import {Status} from '../../utils/mastodon/types';

const getPost = async (id: string) => {
  const result = await fetch(`/api/post?id=${id}`);
  return result;
};

const Item = ({ item, onClick }: { item: any, onClick?: (item: any) => any }) => {
  if (item.type === 'status') {
    return <li style={{ display: 'inline' }}><Toot size={item.size} color={item.color} onClick={() => onClick && onClick(item)}
                                                   selected={item.selected} status={item.data as Status}/></li>;
  } else if (item.type === 'text') {
    const textItem:any = item.data; // TODO: Add type checking
    return <TextItem text={textItem.text} variant={item.size} color={item.color} selected={item.selected} onClick={() => onClick && onClick(item)} />
  } else {
    throw Error(`Unknown item type: ${item.type}`);
  }
};

const Content = ({ item }) => {
  return (
    <div style={{maxWidth: 600, border: '1px solid #ccc', borderRadius: 10, padding: '10px 5px', backgroundColor: '#fff'}}>
      <Typography variant="h5"><b>{item['title']}</b></Typography>
      <Typography variant="body2">{item['description']}</Typography>
      <hr />
      <div>
        {item.data.map(item => <Item item={item} />)}
      </div>
      <div style={{textAlign: 'right', marginTop: 10}}>
        <button>シェアボタン</button>
      </div>
    </div>
  );
};

const Post = () => {
  const router = useRouter();
  const hid = head(router.query.hid);
  const [loading, setLoading] = React.useState(true);
  const [code, setCode] = React.useState<number>();
  const [item, setItem] = React.useState<any>();

  React.useEffect(() => {
    let unmounted = false;
    if(!hid) return;
    getPost(hid).then(result => {
      if (!unmounted) {
        if (result.status === 200) {
          result.json().then(data => {
            setItem(data.data);
            setLoading(false);
          });
        }
        setCode(result.status);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [hid]);

  return (<div>
    <Header/>
    <Container>
      {loading && <CircularProgress/>}
      {!loading && code === 404 && <NextError statusCode={404}/>}
      {!loading && code === 200 && item && <Content item={item}/>}
    </Container>
  </div>);
};

export default Post;