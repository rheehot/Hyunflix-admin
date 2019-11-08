import React, { useState, useEffect } from 'react';
import { PageHeader, Button } from 'antd';
import * as socketio from 'socket.io-client';

import { videoExamine } from 'api';
import { SOCKET_SERVER, VIDEO_EXAMINE_SOCKET_PATH } from 'config';

let socket: SocketIOClient.Socket | null = null;

const VideoExaminePage: React.FunctionComponent = () => {
  const [msgs, setMsgs] = useState([] as string[]);

  useEffect(() => {
    socket = socketio.connect(SOCKET_SERVER, { path: VIDEO_EXAMINE_SOCKET_PATH });

    socket.on('message', (msg: Buffer) => {
      setMsgs(msgs => [...msgs, msg.toString()]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const start = () => {
    setMsgs([]);
    videoExamine();
  };

  const startButton: React.ReactNode = (
    <Button
      type="primary"
      onClick={start}
    >
      Start
    </Button>
  );

  return (
    <div className="article-list-page">
      <div className="page-header">
        <PageHeader title="비디오 검사" extra={startButton}/>
      </div>
      <div className="page-content">
        <pre>{msgs.join('\n')}</pre>
      <div />
      </div>
    </div>
  );
};

export default VideoExaminePage;