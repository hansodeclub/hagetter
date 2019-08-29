import React from 'react';
import { THagetterItem } from '../../stores/hagetterItem';
import { observer } from 'mobx-react-lite';
import Toot, { isPublic } from '../Toot/Toot';
import { Status } from '../../utils/mastodon/types';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme =>
  createStyles({
    toot: {
      borderBottom: '1px solid #cccccc'
    }
  })
);

export const TextItem: React.FC<{
  text: string;
  variant: string;
  color: string;
  selected: boolean;
  onClick: () => any;
}> = ({ text, variant, color, selected, onClick }) => (
  <li style={{ display: 'inline', padding: 0, margin: 0 }}>
    <Typography
      variant={variant as any}
      onClick={() => onClick()}
      style={{
        margin: 0,
        padding: '5px 10px',
        backgroundColor: selected ? '#ffeeee' : '#ffffff',
        color: color
      }}
    >
      {text}
    </Typography>
  </li>
);

const Item = observer(
  ({
    item,
    onClick
  }: {
    item: THagetterItem;
    onClick: (item: THagetterItem) => boolean;
  }) => {
    const classes = useStyles({});

    if (item.type === 'status') {
      const status: Status = item.data as Status;
      return (
        <li style={{ display: 'inline' }}>
          <Toot
            size={item.size}
            color={item.color}
            onClick={() => onClick(item)}
            selected={item.selected}
            status={status}
            className={classes.toot}
          />
        </li>
      );
    } else if (item.type === 'text') {
      const textItem: any = item.data; // TODO: Add type guard
      return (
        <TextItem
          text={textItem.text}
          variant={item.size}
          color={item.color}
          selected={item.selected}
          onClick={() => onClick(item)}
        />
      );
    } else {
      throw Error(`Unknown item type: ${item.type}`);
    }
  }
);

export default Item;
