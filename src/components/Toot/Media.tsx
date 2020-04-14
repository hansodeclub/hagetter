import * as React from 'react';
import { Attachment } from '../../utils/mastodon/types';
import { Lightbox } from 'react-modal-image';

export interface MediaProps {
  attachments: Attachment[];
}

const filterImage = (attachments: Attachment[]) => {
  return attachments.filter(attachment => attachment['type'] === 'image');
};

const Media: React.FC<MediaProps> = ({ attachments }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>();
  const images: Attachment[] = filterImage(attachments);

  return (
    <div>
      {images.map(attachment => {
        const displayUrl = attachment['remote_url'] || attachment['url'];
        return (
          <div key={attachment.id}>
            <a
              onClick={e => {
                setPreviewUrl(displayUrl);
                e.stopPropagation();
              }}
            >
              <img
                src={attachment.preview_url}
                alt="Click and show full size"
                style={{
                  maxWidth: '100%',
                  border: '1px solid #eee',
                  borderRadius: 5
                }}
              />
            </a>
          </div>
        );
      })}
      {previewUrl && (
        <Lightbox
          large={previewUrl}
          alt="Picture"
          onClose={() => setPreviewUrl(undefined)}
        />
      )}
    </div>
  );
};

export default Media;
