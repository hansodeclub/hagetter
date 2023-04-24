import React from 'react'

import Box from '@mui/material/Box'
import { blue } from '@mui/material/colors'

import { PollResult } from '@/features/posts/types'

export interface PollProps {
  onRefresh?: () => void
  poll: PollResult
}

const PollValue: React.FC<{
  title: string
  percentage: number
  highest?: boolean
}> = ({ title, percentage, highest }) => {
  const percentageString = `${(percentage * 100).toFixed(0)}%`

  return (
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ display: 'flex' }} className="flex items-center">
        <Box sx={{ fontWeight: 'bold', marginRight: 2, width: '60px' }}>
          {percentageString}
        </Box>
        <div>{title}</div>
      </Box>
      <Box sx={{ maxWidth: 640 }}>
        <Box
          sx={{
            backgroundColor: highest ? blue[400] : blue[200],
            marginTop: 1,
            borderRadius: 2,
            width: percentageString,
            minWidth: 5,
            height: 7,
          }}
        ></Box>
      </Box>
    </Box>
  )
}

export const Poll: React.FC<PollProps> = ({ poll, onRefresh }) => {
  const total = poll.votesCount
  const maxValue = poll.options.reduce((acc, cur) => {
    if (cur.votesCount > acc || acc === -1) {
      return cur.votesCount
    }
    return acc
  }, -1)

  return (
    <div>
      <Box>
        {poll.options.map((option, i) => (
          <PollValue
            key={i}
            title={option.title}
            percentage={option.votesCount / total}
            highest={option.votesCount === maxValue}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', mt: 2, color: '#888' }}>
        {onRefresh && (
          <Box
            onClick={() => onRefresh()}
            sx={{ textDecoration: 'underline', cursor: 'pointer', mr: 1 }}
          >
            <a>更新</a>
          </Box>
        )}
        <Box>{poll.votersCount}人</Box>
        <Box>·{poll.expired ? <span>終了</span> : <span>投票中</span>}</Box>
      </Box>
    </div>
  )
}

export default Poll
