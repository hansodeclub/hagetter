import * as React from 'react'
import Media from './Media'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LockIcon from '@material-ui/icons/Lock'
import Avatar from '@material-ui/core/Avatar'
import { Status } from '../../utils/mastodon/types'
import emojify, { buildCustomEmojis } from '../../utils/mastodon/emoji'
import Timestamp from './Timestamp'
import clsx from 'clsx'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    selected: {
      backgroundColor: '#ffeeee',
    },
    disabled: {
      //backgroundColor: '#eeeeee'
    },
    left: {
      padding: theme.spacing(1),
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    right: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      paddingLeft: 0,
      flexGrow: 1,
      minWidth: 0,
      maxWidth: '100%',
    },
    header: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    lock: {
      fontSize: 20,
      color: '#ff4040',
    },
    displayName: {
      flexShrink: 0,
    },
    acct: {
      paddingLeft: theme.spacing(1),
      color: '#666',
      minWidth: 0,
      maxWidth: '100%',
      flexGrow: 1,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      wordBreak: 'break-all',
    },
    noWrap: {},

    body: {
      minHeight: 30,
      wordBreak: 'break-all',
    },
    attachments: {
      maxWidth: '100%',
    },
    footer: {
      display: 'flex',
      alignItem: 'middle',
      justifyContent: 'flex-end',
    },
    timestamp: {
      color: '#888',
    },
  })
)

export interface StatusProps {
  status: Status
  selected?: boolean
  disabled?: boolean
  color?: string
  size?: string
  onClick?: (status: Status) => any
  className?: string
  missingAvatar?: string
}

export const isPublic = (visibility) => {
  return visibility === 'public' || visibility === 'unlisted'
}

const Toot: React.FC<StatusProps> = ({
  status,
  size,
  color,
  selected,
  onClick,
  className,
  disabled,
  missingAvatar = '/public/missing.png',
}) => {
  const classes = useStyles({})

  // TODO: fix server name
  return (
    <div
      onClick={() => onClick && onClick(status)}
      className={clsx(
        className,
        classes.root,
        !disabled && selected && classes.selected,
        disabled && classes.disabled
      )}
    >
      <div className={classes.left}>
        <div>
          <Avatar
            alt={status.account.display_name}
            src={status.account.avatar}
            className={classes.avatar}
          />
        </div>
      </div>
      <div className={classes.right}>
        <div className={classes.header}>
          <div className={classes.displayName}>
            {status.account.display_name}
          </div>
          <div className={classes.acct}>{status.account.acct}</div>
        </div>
        <div className={classes.body}>
          {size && (
            <Typography variant={size as any} style={{ color: color }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: emojify(
                    status['content'],
                    buildCustomEmojis(status.emojis)
                  ),
                }}
              />
            </Typography>
          )}
          {!size && (
            <span
              dangerouslySetInnerHTML={{
                __html: emojify(
                  status['content'],
                  buildCustomEmojis(status.emojis)
                ),
              }}
            />
          )}
        </div>
        <div className={classes.attachments}>
          <Media attachments={status.media_attachments} />
        </div>
        <div className={classes.footer}>
          <Timestamp value={status.created_at} className={classes.timestamp} />
          <div className={classes.displayName}>
            {!isPublic(status.visibility) && (
              <LockIcon className={classes.lock} color="action" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toot
