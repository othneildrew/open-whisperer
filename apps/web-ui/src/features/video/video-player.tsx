"use client";

import { RefObject, useEffect, useState } from "react";
import { useGetSessionQuery } from "@open-whisperer/rtk-query";
import { useSessionId } from "@/components/providers/session-id-provider";
import { SERVER_MEDIA_URL } from "@/lib/constants";

export interface VideoPlayerProps {
  ref: RefObject<HTMLVideoElement | null>;
}

export const VideoPlayer = ({ ref }: VideoPlayerProps) => {
  const sessionId = useSessionId();
  const {
    data: session,
    isLoading,
    isSuccess,
  } = useGetSessionQuery(sessionId!, { skip: !sessionId });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isSuccess && session?.id && session?.input) {
      setVideoUrl(`${SERVER_MEDIA_URL}/${session.id}/${session.input}`);
    }
  }, [isLoading, isSuccess, session?.id, session?.input]);

  return (
    <div className="min-h-0 flex-1 flex justify-center items-center w-full bg-black">
      {videoUrl && (
        <video ref={ref} controls className="max-h-full max-w-full w-full h-full object-contain">
          <source
            src={videoUrl}
            type={`video/${((session?.input as string) || "").split(".")[1]}`}
          />
          Your browser does not support the video player
        </video>
      )}
    </div>
  );
};
