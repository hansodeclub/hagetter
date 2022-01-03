import React from 'react'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Toot from '~/components/Toot/Toot'
import { Status } from '~/entities/Mastodon'

const TestPage = () => {
  const testStatus: Status = {
    id: '102660375024130051',
    created_at: '2019-08-22T11:23:27.586Z',
    in_reply_to_id: null,
    in_reply_to_account_id: null,
    sensitive: false,
    spoiler_text: '',
    visibility: 'public',
    language: 'ja',
    uri: 'https://handon.club/users/okamiya/statuses/102660375024130051',
    url: 'https://handon.club/@okamiya/102660375024130051',
    replies_count: 0,
    reblogs_count: 0,
    favourites_count: 0,
    favourited: false,
    reblogged: false,
    muted: false,
    content: '<p>どん美だドン</p>',
    reblog: null,
    application: null,
    account: {
      id: '12345',
      username: 'donmi',
      acct: 'donmiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      display_name: 'どん美',
      locked: true,
      bot: false,
      created_at: '2018-08-17T12:06:59.137Z',
      note: '\u003cp\u003e\u003c/p\u003e',
      url: 'https://handon.club/@okamiya',
      avatar: '/public/donmi_icon.png',
      avatar_static: '/public/donmi_icon.png',
      header: '/public/donmi.png',
      header_static: '/public/donmi.png',
      followers_count: 123,
      following_count: 234,
      statuses_count: 1234,
      emojis: [],
      fields: [],
      last_status_at: '2018-08-17T12:06:59.137Z',
    },
    media_attachments: [],
    mentions: [],
    tags: [],
    emojis: [],
    card: null,
    // poll: null
  } as any

  return (
    <Container>
      <Typography variant={'h4'}>&lt;Toot&gt;</Typography>
      <Paper>
        <Toot
          selected={false}
          color={'black'}
          size="body2"
          status={testStatus}
          onClick={(status) => alert(`Click status: ${status.id}`)}
        />
      </Paper>
      <Paper style={{ width: 600, marginTop: 16 }}>
        <Toot
          selected={true}
          color={'black'}
          size="body2"
          status={testStatus}
          onClick={(status) => alert(`Click status: ${status.id}`)}
        />
      </Paper>
      <Paper style={{ width: 300, marginTop: 16 }}>
        <Toot
          selected={false}
          disabled={true}
          color={'black'}
          size="body2"
          status={{ ...testStatus, visibility: 'private' }}
          onClick={(status) => alert(`Click status: ${status.id}`)}
        />
      </Paper>
    </Container>
  )
}

export default TestPage
