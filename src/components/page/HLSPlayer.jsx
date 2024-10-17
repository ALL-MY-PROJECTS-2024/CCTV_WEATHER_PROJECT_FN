import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({ hlsUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl); // HLS 주소 설정
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // 브라우저가 HLS를 네이티브로 지원하는 경우 (주로 Safari)
      videoRef.current.src = hlsUrl;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      });
    }
  }, [hlsUrl]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', height: 'auto' }}
      ></video>
    </div>
  );
};

export default HLSPlayer;
