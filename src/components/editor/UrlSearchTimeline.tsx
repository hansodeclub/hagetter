import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'

import { Status } from '@/core/domains/post/Status'

import { observer, useEditor, useStore, useUrlSearchTimeline } from '@/stores'

import Toot, { isPublic } from '../Toot/Toot'
import styles from './editorStyles'

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
          sx={{ mt: 1 }}
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
                  preferOriginal
                />
              </Box>
            ))}
          </div>
        </Box>
      </Box>
    </Box>
  )
})

export default UrlSearchTimeline
