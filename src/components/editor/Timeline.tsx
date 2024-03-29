import React from 'react'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

import PullNotch from '@/components/editor/PullNotch'

import { Status } from '@/features/posts/types'
import { observer, useEditor, useTimeline } from '@/stores'

import Toot, { isPublic } from '../Toot/Toot'
import styles from './editorStyles'

const Timeline: React.FC<{ name: string; invisible?: boolean }> = observer(
  ({ name, invisible }) => {
    const store = useTimeline(name)
    const editor = useEditor()
    const itemIds = editor.itemIds
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <Box sx={{ marginTop: 1, mx: 1 }}>
          <TextField
            id="filter-input"
            label={'フィルタ'}
            variant="outlined"
            onChange={onChangeFilter}
            fullWidth
            sx={{ backgroundColor: 'white' }}
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
            <PullNotch
              onRefresh={onRefresh}
              invisible={invisible}
              loadMore={
                !store.init && !store.loading
                  ? () => store.loadMore(false)
                  : undefined
              }
            >
              {store.filteredStatuses.map((status) => (
                <Box
                  key={status.id}
                  sx={[
                    styles.toot as SystemStyleObject<Theme>,
                    itemIds.has(status.id)
                      ? {
                          opacity: 0.6,
                        }
                      : {},
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
            </PullNotch>
          </Box>
        </Box>
      </Box>
    )
  }
)

export default Timeline
