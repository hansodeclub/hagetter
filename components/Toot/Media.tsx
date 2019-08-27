import * as React from 'react';
import { Attachment } from '../../utils/mastodon/types';


export interface MediaProps {
    attachments: Attachment[]
}

const filterImage = (attachments: Attachment[]) => {
    return attachments.filter((attachment) => attachment['type'] === 'image');
}

const Media: React.FC<MediaProps> = ({ attachments }) => {
    const images: Attachment[] = filterImage(attachments);

    return (
        <div>
            {images.map(attachment => {
                const displayUrl = attachment['remote_url'] || attachment['url'];
                return (
                    <div key={attachment.id}>
                        <a href={displayUrl} target='_blank' rel='noopener'>
                            <img src={attachment.preview_url} alt='Click and show full size' />
                        </a>
                    </div>
                );
            })}
        </div>
    );
}

export default Media;