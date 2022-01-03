import * as React from 'react'
import Image from 'next/image'
import { Attachment } from '~/entities/Mastodon'
import { Lightbox } from 'react-modal-image'
import ReactPlayer from 'react-player'

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
          <div
            key={attachment.id}
            style={{ border: '1px solid #eee', borderRadius: '5px' }}
          >
            <a
              onClick={(e) => {
                setPreviewUrl(displayUrl)
                e.stopPropagation()
              }}
            >
              <Image
                src={attachment.preview_url}
                alt="Click and show full size"
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
