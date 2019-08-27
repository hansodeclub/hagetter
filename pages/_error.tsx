import * as React from 'react';
import Error from 'next/error';
import { NextPage } from 'next';

interface Props {
  statusCode?: number;
}

const MyError: NextPage<Props> = ({ statusCode }) => {
  if (statusCode === 404) {
    return (
      <p style={{ textAlign: 'center', margin: 'auto' }}>
        <img src="/static/donmi404s.png" />
      </p>
    );
  }

  return <Error statusCode={statusCode} />;
};

MyError.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default MyError;
