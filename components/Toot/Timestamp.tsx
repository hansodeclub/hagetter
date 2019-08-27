import * as React from 'react';
import moment from 'moment';

const Timestamp: React.FC<{ value: string }> = ({ value }) => {
    const date = moment(value);
    return <>{date.format('YYYY-MM-DD HH:mm:ss')}</>;
}

export default Timestamp;