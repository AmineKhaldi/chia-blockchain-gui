import React from 'react';
import { Trans } from '@lingui/macro';
import { useRouteMatch } from 'react-router-dom';
import { Link } from '@chia/core';
import { LazyLog, ScrollFollow } from 'react-lazylog'
import LayoutMain from '../layout/LayoutMain';
import { LogsHeaderTarget } from './LogsHeader';
import logwebsocket from './logwebsocket';

class ChiaLog extends LazyLog {
  initEmitter() {
    const {
      url,
      websocketOptions,
    } = this.props;

    const keyStr: string | null = localStorage.getItem("WSS-KEY");
    const certStr: string | null = localStorage.getItem("WSS-CERT");

    const cert_options = {
      cert: certStr,
      key: keyStr,
      rejectUnauthorized: false,
      perMessageDeflate: false,
      maxPayload: 5000000000,
    };

    return logwebsocket(url, websocketOptions, cert_options);
  }
}

export default function Logs() {
  const { path } = useRouteMatch();
  const url = 'wss://localhost:55400';

  return (
    <LayoutMain
      maxWidth="false"
      loading={false}
      loadingTitle={<Trans>Loading Logs</Trans>}
      title={
        <>
          <Link to="/dashboard/logs" color="textPrimary">
            <Trans>Logs</Trans>
          </Link>
          <LogsHeaderTarget />
        </>
      }
    >
      <ScrollFollow
        startFollowing={true}
        render={({ onScroll, follow }) => (
          <ChiaLog
            extraLines={2}
            enableSearch
            caseInsensitive
            selectableLines={true}
            url={url}
            stream
            onScroll={onScroll}
            follow={follow} />
        )}
      />
    </LayoutMain>
  );
}