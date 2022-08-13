import React from 'react'
import { observer } from 'mobx-react-lite'
import {
  useStore,
  useTimeline,
  useSearchTimeline,
  useUrlSearchTimeline,
  useEditor,
} from '@/stores'

import Toot, { isPublic } from '../Toot/Toot'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/HomeRounded'
import PeopleIcon from '@mui/icons-material/PeopleRounded'
import PublicIcon from '@mui/icons-material/PublicRounded'
import SearchIcon from '@mui/icons-material/SearchRounded'
import StarIcon from '@mui/icons-material/StarRounded'
import LinkIcon from '@mui/icons-material/LinkRounded'

import LinearProgress from '@mui/material/LinearProgress'

import {
  PullToRefresh,
  ReleaseContent,
  RefreshContent,
  PullDownContent,
} from 'react-js-pull-to-refresh'

import { Status } from '@/entities/Status'
import { SxProps, Theme } from '@mui/material/styles'
import { Typography } from '@mui/material'

import styles from './editorStyles'

/*
const styles: { [key: string]: SxProps<Theme> } = {
  gridColumn: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    marginTop: 1,
  },
  searchArea: {
    // marginTop: '5px',
  },
  timelineContent: {
    position: 'relative',
    flexGrow: 1,
    boxSizing: 'border-box',
    marginTop: 1,
    height: '100%',
    backgroundColor: 'white',
  },
  tootSelector: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'scroll',
    '-webkit-overflow-scrolling': 'touch',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  } as SxProps<Theme>,
  selectorButtom: {
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '30px',
  },
  menu: {
    border: '1px solid #ccc',
  },
  howToContainer: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    flexGrow: 1,
    marginTop: '5px',
    marginBottom: '2px',
  },
  howTo: {
    margin: 3,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#f1f1f1',
  },
  howToText: {
    width: '100%',
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2,
  },
  toot: {
    borderBottom: '1px solid #ccc',
  },
} */

const HowTo: React.FC = () => {
  return (
    <Box sx={styles.howTo}>
      <Typography sx={styles.howToTitle}>使い方</Typography>
      <ul>
        <li>タイムラインからまとめるやつを探しましょう</li>
        <li>クリックで右に追加されます</li>
        <li>まとめには大きな責任が伴います</li>
      </ul>
    </Box>
  )
}

const Timeline: React.FC<{ name: string }> = observer(({ name }) => {
  const store = useTimeline(name)
  const editor = useEditor()
  React.useEffect(() => {
    if (store.init) {
      store.reload().catch(console.error)
    }
  }, [])

  const onStatusSelect = (status: Status) => {
    editor.addStatus(status, editor.getAnchor())
    return false
  }

  const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.setFilter(event.target.value)
  }

  const onRefresh = async () => {
    try {
      await store.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box sx={styles.outer}>
      <Box sx={styles.header}>
        <TextField
          id="filter-input"
          label={'フィルタ'}
          variant="outlined"
          onChange={onChangeFilter}
          fullWidth
          style={{ backgroundColor: 'white' }}
        />
      </Box>
      <Box sx={styles.content}>
        {store.loading && <LinearProgress sx={styles.progress} />}
        <Box sx={styles.tootSelector}>
          <PullToRefresh
            pullDownContent={<PullDownContent label="リロード" />}
            releaseContent={<ReleaseContent />}
            refreshContent={<RefreshContent height="100" />}
            pullDownThreshold={100}
            onRefresh={onRefresh}
            triggerHeight={50}
            backgroundColor="white"
          >
            <div id="basic-container">
              {store.filteredStatuses.map((status) => (
                <Box key={status.id} sx={styles.toot}>
                  <Toot
                    onClick={onStatusSelect}
                    key={status.id}
                    status={status}
                    disabled={!isPublic(status.visibility)}
                    originalOnly
                  />
                </Box>
              ))}
              {!store.init &&
                !store.loading &&
                store.type !== 'favourites' && ( // favはmax_idをlinkヘッダから取得しないといけないので未対応
                  <Box sx={styles.selectorButtom}>
                    <button onClick={() => store.loadMore()}>
                      もっと読み込む
                    </button>
                  </Box>
                )}
            </div>
          </PullToRefresh>
        </Box>
      </Box>
    </Box>
  )
})

const SearchTimeline: React.FC = observer(() => {
  const store = useSearchTimeline()
  const editor = useEditor()

  const [keyword, setKeyword] = React.useState('')
  const onSearch = async (keyword: string) => {
    await store.search(keyword)
    //for await (const it of store.search(keyword)) { console.log('it') }
  }
  const onStatusSelect = (status: Status) => {
    editor.addStatus(status, editor.getAnchor())
    return false
  }

  const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.setFilter(event.target.value)
  }

  const onRefresh = async () => {}

  return (
    <Box sx={styles.outer}>
      <Box sx={styles.header}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSearch(keyword)
            return false
          }}
        >
          <TextField
            id="filter-input"
            label={'検索'}
            variant="outlined"
            onChange={(event) => setKeyword(event.target.value)}
            fullWidth
            sx={styles.textField}
          />
        </form>
      </Box>
      <Box sx={styles.header}>
        <TextField
          id="filter-input"
          label={'フィルタ'}
          variant="outlined"
          onChange={onChangeFilter}
          fullWidth
          sx={styles.textField}
        />
      </Box>
      <Box sx={styles.content}>
        {store.loading && <LinearProgress sx={styles.progress} />}
        <Box sx={styles.tootSelector}>
          <PullToRefresh
            pullDownContent={<PullDownContent label="リロード" />}
            releaseContent={<ReleaseContent />}
            refreshContent={<RefreshContent height="100" />}
            pullDownThreshold={100}
            onRefresh={onRefresh}
            triggerHeight={50}
            backgroundColor="white"
          >
            <div id="basic-container">
              {store.filteredStatuses.map((status) => (
                <Box key={status.id} sx={styles.toot}>
                  <Toot
                    onClick={onStatusSelect}
                    key={status.id}
                    status={status}
                    disabled={!isPublic(status.visibility)}
                    originalOnly
                  />
                </Box>
              ))}
            </div>
          </PullToRefresh>
        </Box>
      </Box>
    </Box>
  )
})

const UrlSearchTimeline: React.FC = observer(() => {
  const store = useUrlSearchTimeline()
  const editor = useEditor()
  const app = useStore()

  const [keyword, setKeyword] = React.useState('')

  const onStatusSelect = (status: Status) => {
    editor.addStatus(status, editor.getAnchor())
    return false
  }

  const onSearch = async (keyword: string) => {
    try {
      await store.search(keyword)
    } catch (err) {
      console.error(err)
      app.notifyError(err)
    }
    //for await (const it of store.search(keyword)) { console.log('it') }
  }

  return (
    <>
      <Box sx={styles.header}>
        <TextField
          id="filter-input"
          label={'URL'}
          variant="outlined"
          onChange={(event) => setKeyword(event.target.value)}
          fullWidth
          multiline
          rows={2}
          style={{ backgroundColor: 'white', marginTop: 5 }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ float: 'right' }}
          onClick={() => onSearch(keyword)}
        >
          検索
        </Button>
      </Box>
      <Box sx={styles.content}>
        {store.loading && <LinearProgress sx={styles.progress} />}
        <Box sx={styles.tootSelector}>
          <div id="basic-container">
            {store.statuses.map((status) => (
              <Box key={status.id} sx={styles.toot}>
                <Toot
                  onClick={onStatusSelect}
                  key={status.id}
                  status={status}
                  disabled={!isPublic(status.visibility)}
                  originalOnly
                />
              </Box>
            ))}
          </div>
        </Box>
      </Box>
    </>
  )
})

const StatusSelector: React.FC = observer(() => {
  const [viewType, setViewType] = React.useState<number | false>(false)

  const onChangeType = React.useCallback(
    async (event: React.ChangeEvent<{}>, newValue: number) => {
      setViewType(newValue)
    },
    []
  )

  return (
    <>
      <Paper elevation={0} sx={styles.tabs}>
        <Tabs
          value={viewType}
          onChange={onChangeType}
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
          variant="fullWidth"
        >
          <Tab style={{ minWidth: 50 }} icon={<HomeIcon />} aria-label="home" />
          <Tab
            style={{ minWidth: 50 }}
            icon={<PeopleIcon />}
            aria-label="local"
          />
          <Tab
            style={{ minWidth: 50 }}
            icon={<PublicIcon />}
            aria-label="public"
          />
          <Tab
            style={{ minWidth: 50 }}
            icon={<StarIcon />}
            aria-label="favourites"
          />
          <Tab
            style={{ minWidth: 50 }}
            icon={<SearchIcon />}
            aria-label="search"
          />
          <Tab style={{ minWidth: 50 }} icon={<LinkIcon />} aria-label="url" />
        </Tabs>
      </Paper>
      {viewType === 0 && <Timeline name="home" />}
      {viewType === 1 && <Timeline name="local" />}
      {viewType === 2 && <Timeline name="public" />}
      {viewType === 3 && <Timeline name="favourites" />}
      {viewType === 4 && <SearchTimeline />}
      {viewType === 5 && <UrlSearchTimeline />}
      {viewType === false && (
        <Box sx={styles.content}>
          <HowTo />
        </Box>
      )}
    </>
  )
})

export default StatusSelector
