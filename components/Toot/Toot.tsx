import * as React from 'react';
import Media from './Media';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import { Status } from '../../utils/mastodon/types';
import emojify from '../../utils/mastodon/emoji';
import Timestamp from './Timestamp';
import './Toot.scss';

export interface StatusProps {
    status: Status
    selected?: boolean
    color?: string
    size?: string
    onClick?: (status: Status) => boolean
}

const Toot: React.FC<StatusProps> = ({ status, size, color, selected, onClick }) =>
    <article>
        <div className={`status ${selected ? 'selected' : ''}`} onClick={
            () => { return onClick && status.visibility != 'private' && status.visibility !== 'direct' ? onClick(status) : false }}>
            <div className='avatar-wrapper'>
                <img src={status.account.avatar} alt='avatar' /*onError={(e) => { (e as any).target.src = "/missing.png" }}*/ />
            </div>
            <div className='content'>
                <div className='name'>
                    <span className='display_name'>{status.account.display_name}</span>
                    <span className='acct'>@{status.account.acct}</span>
                    <span>{(status.visibility == 'private' || status.visibility == 'direct') && <LockIcon className='lock' />}</span>
                </div>
                <div className='body'>
                    {size && <Typography variant={size as any} style={{ color: color }}>
                        <span dangerouslySetInnerHTML={{ __html: status['content'] }} />
                    </Typography>}
                    {!size &&
                        <span dangerouslySetInnerHTML={{ __html: status['content'] }} />
                    }
                </div>
                <div className='attachments'>
                    <Media attachments={status.media_attachments} />
                </div>
                <div className='footer timestamp'>
                    <Timestamp value={status.created_at} />
                </div>
            </div>
        </div>
    </article>

//                    <span dangerouslySetInnerHTML={{ __html: emojify(status['content'], status.emojis) }} />

export default Toot;