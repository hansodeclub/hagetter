import * as React from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getList } from '../../utils/hage';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import clsx from 'clsx';

const useStyles = makeStyles(theme =>
  createStyles({
    matomeTitle: {
      padding: 5
    },
    itemBox: {
      minHeight: 50,
      borderTop: '1px solid gray',
      margin: 0
    },
    name: {
      paddingTop: 5,
      height: 30,
      marginLeft: 5
    },
    avatar: {
      width: 32,
      height: 32
    },
    innerBox: {
      textDecoration: 'none',
      margin: 0,
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 5,
      color: '#000',
      '&:hover': {
        backgroundColor: '#eee',
        color: 'orange'
      }
    },
    title: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: 5
    },
    footer: {
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

const Content: React.FC<{ items: any; className?: string }> = ({
  items,
  className
}) => {
  const classes = useStyles({});

  return (
    <div className={clsx(className)}>
      {items.map(item => (
        <div key={item.id} className={classes.itemBox}>
          <a href={`/hi/${item.id}`} style={{ textDecoration: 'none' }}>
            <div className={classes.innerBox}>
              <div className={classes.title}>{item.title}</div>
              <div className={classes.footer}>
                <Avatar src={item.avatar} className={classes.avatar} />
                <div className={classes.name}>{item.displayName}</div>
                <div className={classes.grow} />
                <div style={{ marginTop: 5 }}>
                  {moment(item.created_at).format('YYYY-MM-DD HH:MM:SS')}
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

const MatomeList = () => {
  const router = useRouter();
  const classes = useStyles({});
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<any>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    let unmounted = false;
    getList().then(result => {
      if (!unmounted) {
        if (result.data) {
          setItems(result.data.items);
          setLoading(false);
        } else if (result.error) {
          setError(result.error.message);
          setLoading(false);
        }
      }
    });
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div>
      <Typography variant="body1" className={classes.matomeTitle}>
        <strong>新着まとめ</strong>
      </Typography>
      {loading && <CircularProgress />}
      {!loading && !error && items && <Content items={items} />}
      {!loading && error && <p>{error}</p>}
    </div>
  );
};

export default MatomeList;
