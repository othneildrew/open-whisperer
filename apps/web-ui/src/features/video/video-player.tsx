import { RefObject, useEffect, useState } from 'react';
import { useVideoAspectRatio } from '@/features/video/useVideoAspectRatio';

export interface VideoPlayerProps {
  ref?: RefObject<HTMLVideoElement> | null;
}

export const VideoPlayer = ({ ref: forwardedRef }: VideoPlayerProps) => {
  const { tailwindClass, ratio } = useVideoAspectRatio(forwardedRef);
  const [aspectClass, setAspectClass] = useState<string>('aspect-class');

  useEffect(() => {
    console.log('forwarded ref:::', forwardedRef);
    
    console.log(':::::', { tailwindClass, ratio })

  }, [forwardedRef, ratio, tailwindClass]);



  return (
    <div className={`flex bg-black ${tailwindClass} max-w-[100%]`}>
      <video ref={forwardedRef} controls playsInline className="w-full h-full object-contain">
        <source src="/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video player
      </video>
    </div>
  );
}
