import * as React from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import head from '../../utils/head';
import { getList } from '../../utils/hage';

const Content: React.FC<{ items: any }> = ({ items }) => {
  return items.map(item => (
    <div>
      <p>
        <a href={`/hi/${item.id}`}>{item.title}</a>
      </p>
      <img src={item.avatar} />
      <p>{item.displayName}</p>
    </div>
  ));
};

const MatomeList = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<any>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    let unmounted = false;
    getList().then(result => {
      console.log(result);
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
      <Typography variant="body1">新着まとめ</Typography>
      {loading && <CircularProgress />}
      {!loading && !error && items && <Content items={items} />}
      {!loading && error && <p>{error}</p>}
    </div>
  );
};

export default MatomeList;
