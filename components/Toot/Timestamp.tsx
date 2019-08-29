import * as React from 'react';
import moment from 'moment';

const Timestamp: React.FC<{ value: string; className?: string }> = ({
  value,
  className
}) => {
  const date = moment(value);
  return <div className={className}>{date.format('YYYY-MM-DD HH:mm:ss')}</div>;
};

export default Timestamp;
