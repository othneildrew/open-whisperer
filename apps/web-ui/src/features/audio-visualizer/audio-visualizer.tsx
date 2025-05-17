'use client';

import colors from 'tailwindcss/colors';
import { Ref, useEffect, useRef } from 'react';
import { useWavesurfer } from '@wavesurfer/react';

export interface AudioVisualizerProps {
  videoRef?: Ref<HTMLVideoElement>;
}

export const AudioVisualizer = ({ videoRef }: AudioVisualizerProps) => {
  const ref = useRef(null);
  // const [] =


  useEffect(() => {
    console.log('video ref from audio visualizer:::', videoRef);
  }, [videoRef]);

  const {} = useWavesurfer({
    container: ref,
    height: 'auto',
    // waveColor: 'rgba(200, 0, 200, 0.8)',
    waveColor: colors.teal[500],
    // waveColor: '#984AE8',
    progressColor: colors.teal[700],
    cursorWidth: 3,
    cursorColor: colors.white,
    // @ts-expect-error asdf
    media: videoRef.current,
    normalize: true,
    autoCenter: true,
    sampleRate: 16000,
  });



  return (
    <div className="grid grid-rows-[1fr_32px] border-1">
      <div ref={ref} className="flex-1" />

      <div className="flex justify-end items-center border-t-1">
        <p className="mx-1 dark:text-white/55">18/75</p>
      </div>
    </div>
  );
}
