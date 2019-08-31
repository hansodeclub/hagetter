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
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme =>
  createStyles({
    name: {
      paddingTop: 5,
      height: 30,
      marginLeft: 5
    },
    avatar: {
      width: 32,
      height: 32
    },
    title: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: 5
    },
    footer: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center'
    },
    grow: {
      flexGrow: 1
    }
  })
);

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
  const classes = useStyles({});
  return (
    <div style={{maxWidth: 600, border: '1px solid #ccc', borderRadius: 10, padding: '10px 5px', backgroundColor: '#fff'}}>
      <Typography variant="h5"><b>{item['title']}</b></Typography>
      <Typography variant="body2">{item['description']}</Typography>
      <div className={classes.footer}>
        <Avatar src={item.avatar} className={classes.avatar} />
        <div className={classes.name}>{item.displayName}</div>
        <div className={classes.grow} />
        <div style={{ marginTop: 5 }}>
          {moment(item.created_at).format('YYYY-MM-DD HH:MM:SS')}
        </div>
      </div>
      <hr />
      <div>
        {item.data.map(item => <Item item={item} />)}
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