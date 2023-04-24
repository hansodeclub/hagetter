import * as React from 'react'

import dynamic from 'next/dynamic'
import { Lightbox } from 'react-modal-image'

import { Attachment } from '@/features/posts/types'

// dynamic import react-player to prevent hydration error
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export interface MediaProps {
  attachments: Attachment[]
}

const filterMedia = (attachments: Attachment[], mediaType) => {
  return attachments.filter((attachment) => attachment['type'] === mediaType)
}

const filterVideo = (attachments: Attachment[]) => {
  return attachments.filter(
    (attachment) =>
      attachment['type'] === 'video' || attachment['type'] === 'gifv'
  )
}

const Media: React.FC<MediaProps> = ({ attachments }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>()
  const images: Attachment[] = filterMedia(attachments, 'image')
  const videos: Attachment[] = filterVideo(attachments)

  return (
    <div>
      {images.map((attachment) => {
        const displayUrl = attachment['remote_url'] || attachment['url']
        return (
          <div key={attachment.id}>
            <a
              onClick={(e) => {
                setPreviewUrl(displayUrl)
                e.stopPropagation()
              }}
            >
              <img
                src={attachment.previewUrl}
                alt="Click and show full size"
                style={{
                  maxWidth: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                }}
              />
            </a>
          </div>
        )
      })}
      {previewUrl && (
        <Lightbox
          large={previewUrl}
          alt="Picture"
          onClose={() => setPreviewUrl(undefined)}
        />
      )}
      {videos.map((attachment) => {
        const displayUrl = attachment['remote_url'] || attachment['url']
        return (
          <div
            key={attachment.id}
            style={{ position: 'relative', paddingTop: '56.25%' }}
          >
            <ReactPlayer
              url={displayUrl}
              controls={true}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Media
