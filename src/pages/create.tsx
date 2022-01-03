import React from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { SxProps, Theme } from '@mui/material/styles'
import StatusSelector from '~/components/editor/StatusSelector'
import PostEditor from '~/components/editor/PostEditor'
import PostInfoEditor from '~/components/editor/PostInfoEditor'

const gridStyle: SxProps<Theme> = {
  height: '100vh',
  paddingTop: 1,
  paddingBottom: 1,
}

const columnStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const Create = () => {
  return (
    <Container sx={{ minWidth: 1000 }}>
      <Grid container columnSpacing={2} sx={gridStyle}>
        <Grid item xs={4} sx={columnStyle}>
          <StatusSelector />
        </Grid>
        <Grid item xs={4} sx={columnStyle}>
          <PostEditor />
        </Grid>
        <Grid item xs={4}>
          <PostInfoEditor />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Create
