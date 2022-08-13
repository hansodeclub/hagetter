import React from 'react'
import { SxProps } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import NoSsr from '@mui/material/NoSsr'
import path from 'path'

interface AvatarProps {
  src: string
  acct?: string
  alt: string
  preferOriginal?: boolean
  sx: SxProps
}

const FallbackAvatar: React.FC<AvatarProps> = ({
  src,
  acct,
  alt,
  sx,
  preferOriginal,
}) => {
  const baseUri = process.env.NEXT_PUBLIC_MEDIA_URL
  if (!baseUri) {
    console.error('NEXT_PUBLIC_MEDIA_URL is not set')
    return null
  }

  const ext = path.extname(src)
  const cachedAvatar = `${baseUri}/avatars/${Buffer.from(src).toString(
    'base64'
  )}${ext}`
  const fallbackAvatar = acct
    ? `${baseUri}/avatars/${Buffer.from(acct).toString('base64')}`
    : undefined

  if (preferOriginal) {
    return (
      <NoSsr>
        <Avatar alt={alt} src={src} sx={sx}>
          {acct && (
            <Avatar alt={alt} src={cachedAvatar} sx={sx}>
              <Avatar alt={alt} src={fallbackAvatar} sx={sx} />
            </Avatar>
          )}
          {!acct && <Avatar alt={alt} src={cachedAvatar} sx={sx} />}
        </Avatar>
      </NoSsr>
    )
  }

  return (
    <NoSsr>
      <Avatar alt={alt} src={cachedAvatar} sx={sx}>
        {acct && (
          <Avatar alt={alt} src={fallbackAvatar} sx={sx}>
            <Avatar alt={alt} src={src} sx={sx} />
          </Avatar>
        )}
        {!acct && <Avatar alt={alt} src={src} sx={sx} />}
      </Avatar>
    </NoSsr>
  )
}

export default FallbackAvatar
