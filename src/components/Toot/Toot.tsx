import * as React from 'react'
import Media from './Media'
import Typography from '@mui/material/Typography'
import LockIcon from '@mui/icons-material/Lock'
import Avatar from '@mui/material/Avatar'
import { Status } from '~/entities/Mastodon'
import emojify, { buildCustomEmojis } from '~/utils/mastodon/emoji'
import Timestamp from './Timestamp'
import { SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'

const styles: any = {
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
    padding: 1,
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '5px',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    padding: 1,
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
    fontSize: '20px',
    color: '#ff4040',
  },
  displayName: {
    flexShrink: 0,
  },
  acct: {
    paddingLeft: 1,
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
    minHeight: '30px',
    wordBreak: 'break-all',
    '& a': {
      color: '#4040ff',
      textDecoration: 'none',
    },
    '& a:hover': {
      color: '#ff4040',
      textDecoration: 'underline',
    },
  },
  attachments: {
    maxWidth: '100%',
  },
  footer: {
    display: 'flex',
    alignItem: 'middle',
    justifyContent: 'flex-end',
    '& a': {
      textDecoration: 'none',
      color: '#888',
    },
    '& a:hover': {
      textDecoration: 'underline',
      color: '#888',
    },
  } as SxProps<Theme>,
  timestamp: {
    color: '#888',
  },
}

export interface StatusProps {
  status: Status
  selected?: boolean
  disabled?: boolean
  color?: string
  size?: string
  onClick?: (status: Status) => any
  className?: string
  missingAvatar?: string
  sx?: SxProps<Theme>
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
  sx,
}) => {
  return (
    <Box
      onClick={() => onClick && onClick(status)}
      sx={[
        styles.root,
        !disabled && selected && styles.selected,
        disabled && styles.disabled,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={styles.left}>
        <div>
          <Avatar
            alt={status.account.display_name || status.account.username}
            src={status.account.avatar}
            sx={styles.avatar}
          />
        </div>
      </Box>
      <Box sx={styles.right}>
        <Box sx={styles.header}>
          <Box sx={styles.displayName}>
            {status.account.display_name || status.account.username}
          </Box>
          <Box sx={styles.acct}>{status.account.acct}</Box>
        </Box>
        <Box sx={styles.body}>
          {size && (
            <Typography
              variant={size === 'inherit' ? 'subtitle2' : (size as any)}
              style={{ color: color }}
            >
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
        </Box>
        <Box sx={styles.attachments}>
          <Media attachments={status.media_attachments} />
        </Box>
        <Box sx={styles.footer}>
          <a href={status.url} target="_blank" rel="noreferrer">
            <Timestamp value={status.created_at} sx={styles.timestamp} />
          </a>

          <Box sx={styles.displayName}>
            {!isPublic(status.visibility) && (
              <LockIcon sx={styles.lock} color="action" />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Toot
