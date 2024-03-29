import React from 'react'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

import PullNotch from '@/components/editor/PullNotch'

import { Status } from '@/features/posts/types'
import { observer, useEditor, useSearchTimeline } from '@/stores'

import Toot, { isPublic } from '../Toot/Toot'
import styles from './editorStyles'

const SearchTimeline: React.FC<{ invisible?: boolean }> = observer(
  ({ invisible }) => {
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

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <Box sx={{ marginTop: 1, mx: 1 }}>
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
            />
          </form>
        </Box>
        <Box sx={{ marginTop: 1, mx: 1 }}>
          <TextField
            id="filter-input"
            label={'フィルタ'}
            variant="outlined"
            onChange={onChangeFilter}
            fullWidth
          />
        </Box>
        <Box
          sx={{
            position: 'relative',
            flexGrow: 1,
            marginTop: 1,
          }}
        >
          {store.loading && <LinearProgress sx={styles.progress} />}
          <Box sx={styles.tootSelector}>
            {store.filteredStatuses.map((status) => (
              <Box
                key={status.id}
                sx={[
                  styles.toot as SystemStyleObject<Theme>,
                  editor.itemIds.has(status.id) ? { opacity: 0.8 } : {},
                ]}
              >
                <Toot
                  onClick={onStatusSelect}
                  key={status.id}
                  status={status}
                  disabled={!isPublic(status.visibility)}
                  preferOriginal
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    )
  }
)

export default SearchTimeline
