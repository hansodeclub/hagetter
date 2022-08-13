import React from 'react'
import { SxProps } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import path from 'path'

interface AvatarProps {
  src: string
  acct?: string
  alt: string
  originalOnly?: boolean
  sx: SxProps
}

const FallbackAvatar: React.FC<AvatarProps> = ({
  src,
  acct,
  alt,
  sx,
  originalOnly,
}) => {
  const baseUri = process.env.NEXT_PUBLIC_MEDIA_URL
  if (!baseUri) {
    console.error('NEXT_PUBLIC_MEDIA_URL is not set')
    return null
  }

  if (originalOnly) {
    return <Avatar alt={alt} src={src} sx={sx} />
  }

  const ext = path.extname(src)
  const cachedAvatar = `${baseUri}/avatars/${Buffer.from(src).toString(
    'base64'
  )}${ext}`
  const fallbackAvatar = acct
    ? `${baseUri}/avatars/${Buffer.from(acct).toString('base64')}`
    : undefined

  return (
    <Avatar alt={alt} src={cachedAvatar} sx={sx}>
      {acct && (
        <Avatar alt={alt} src={fallbackAvatar} sx={sx}>
          <Avatar alt={alt} src={src} sx={sx} />
        </Avatar>
      )}
      {!acct && <Avatar alt={alt} src={src} sx={sx} />}
    </Avatar>
  )
}

export default FallbackAvatar
