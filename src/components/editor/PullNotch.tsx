import React from 'react'

import {
  PullDownContent,
  PullToRefresh,
  RefreshContent,
  ReleaseContent,
} from 'react-js-pull-to-refresh'

import Box from '@mui/material/Box'

import styles from '@/components/editor/editorStyles'

export interface PullNotchProps {
  onRefresh?: () => any
  children?: React.ReactNode
  loadMore?: () => any
  invisible?: boolean
}

export const PullNotch: React.FC<PullNotchProps> = ({
  onRefresh,
  children,
  loadMore,
  invisible,
}) => {
  return (
    <PullToRefresh
      pullDownContent={!invisible && <PullDownContent label="リロード" />}
      releaseContent={<ReleaseContent />}
      refreshContent={<RefreshContent height="100" />}
      pullDownThreshold={100}
      onRefresh={onRefresh}
      triggerHeight={50}
      backgroundColor="white"
    >
      <div id="basic-container">
        <Box
          sx={{
            width: '40px',
            height: '6px',
            borderRadius: '3px',
            mt: 1,
            mx: 'auto',
            backgroundColor: '#aaa',
          }}
        />
        {children}
        {loadMore && (
          <Box sx={styles.selectorButtom}>
            <button onClick={loadMore}>もっと読み込む</button>
          </Box>
        )}
      </div>
    </PullToRefresh>
  )
}

export default PullNotch
