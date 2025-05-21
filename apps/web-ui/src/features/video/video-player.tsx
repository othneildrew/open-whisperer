'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGetSessionQuery } from '@open-whisperer/rtk-query';
import { useSessionId } from '@/components/providers/session-id-provider';
import { BACKEND_SERVER_MEDIA_URL } from '@/lib/constants';
import { useVideo } from '@/components/providers/video-provider';

export const VideoPlayer = () => {
  const sessionId = useSessionId();
  const {
    data: session,
    isLoading,
    isSuccess,
  } = useGetSessionQuery(sessionId!, { skip: !sessionId });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { videoRef, setInitialized } = useVideo();

  const ext = useMemo(() => {
    return session?.input?.split('.').reverse()[0];
  }, [session?.input]);

  useEffect(() => {
    if (!isLoading && isSuccess && session?.id && session?.input) {
      setVideoUrl(
        `${BACKEND_SERVER_MEDIA_URL}/${session.id}/${session.output || session.input}`
      );
    }
  }, [isLoading, isSuccess, session]);

  useEffect(() => {
    if (videoUrl) {
      setInitialized(true);
    }
  }, [setInitialized, videoRef, videoUrl]);

  return (
    <div className="min-h-0 flex-1 flex justify-center items-center w-full bg-black">
      {videoUrl && (
        <video
          controls
          ref={videoRef}
          className="max-h-full max-w-full w-full h-full object-contain"
        >
          <source src={videoUrl} type={`video/${ext}`} />
          Your browser does not support the video player. Here is a
          <a href={videoUrl} download={videoUrl}>
            link to the video
          </a>
          .
        </video>
      )}
    </div>
  );
};
