"use client";

import colors from "tailwindcss/colors";
import { RefObject, useEffect, useRef } from "react";
// import HoverPlugin from "wavesurfer.js/dist/plugins/hover.esm.js";
// import { useSessionId } from "@/components/providers/session-id-provider";
// import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import WaveSurfer from "wavesurfer.js";
// import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import { useVideo } from "@/components/providers/video-provider";

export interface AudioVisualizerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export const AudioVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer>(null);
  // const sessionId = useSessionId();
  const { videoRef, initialized } = useVideo();

  useEffect(() => {
    if (containerRef.current && initialized) {
      console.log('create wavesurfer instance')
      waveSurferRef.current = WaveSurfer.create({
        container: (containerRef.current as HTMLElement) ?? undefined,
        // height: 'auto',
        // waveColor: 'rgba(200, 0, 200, 0.8)',
        // waveColor: colors.teal[500],
        waveColor: 'orange',
        // waveColor: '#984AE8',
        progressColor: colors.teal[700],
        cursorWidth: 2,
        cursorColor: colors.white,
        media: undefined,
        normalize: true,
        // autoCenter: true,
        // dragToSeek: true,
        // sampleRate: 16000,
        // autoScroll: true,
        // hideScrollbar: true,
        // mediaControls: true,
        // minPxPerSec: 100,
        plugins: [
          // HoverPlugin.create({
          //   lineColor: colors.teal[800],
          // }),
          // TimelinePlugin.create(),
          // ZoomPlugin.create({
          //   scale: 0.5,
          //   maxZoom: 100,
          // }),
        ],
      });
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    }
  }, [initialized, videoRef]);

  useEffect(() => {
    // console.log("wavesurfer instance should be created");

    // waveSurferRef.current = WaveSurfer.create({
    //   container: (containerRef.current as HTMLElement) ?? undefined,
    //   // height: 'auto',
    //   // waveColor: 'rgba(200, 0, 200, 0.8)',
    //   waveColor: colors.teal[500],
    //   // waveColor: '#984AE8',
    //   progressColor: colors.teal[700],
    //   cursorWidth: 2,
    //   cursorColor: colors.white,
    //   media: videoRef?.current ?? undefined,
    //   normalize: true,
    //   autoCenter: true,
    //   dragToSeek: true,
    //   sampleRate: 16000,
    //   autoScroll: true,
    //   hideScrollbar: true,
    //   mediaControls: true,
    //   minPxPerSec: 100,
    //   plugins: [
    //     // HoverPlugin.create({
    //     //   lineColor: colors.teal[800],
    //     // }),
    //     // TimelinePlugin.create(),
    //     // ZoomPlugin.create({
    //     //   scale: 0.5,
    //     //   maxZoom: 100,
    //     // }),
    //   ],
    // });

    // const timeout = setTimeout(() => {
    // waveSurferRef.current = WaveSurfer.create({
    //   container: containerRef.current!,
    //   // height: 100,
    //   waveColor: colors.teal[500],
    //   progressColor: colors.teal[700],
    //   cursorWidth: 2,
    //   cursorColor: colors.white,
    //   media: videoRef.current!,
    //   normalize: true,
    //   autoCenter: true,
    //   dragToSeek: true,
    //   sampleRate: 16000,
    //   autoScroll: true,
    //   hideScrollbar: true,
    //   mediaControls: true,
    //   minPxPerSec: 100,
    // });
    // // }, 200);
    //
    // return () => {
    //   // clearTimeout(timeout);
    //   waveSurferRef?.current?.destroy();
    //   waveSurferRef.current = null;
    // };
  }, []);

  return (
    <div className="flex-1 w-full h-[200px]">
      <div ref={containerRef} className="relative h-full w-full border border-green-500" />

      {/*<div className="flex justify-end items-center border-t-1">*/}
      {/*  <p className="mx-1 dark:text-white/55">18/75</p>*/}
      {/*</div>*/}
    </div>
  );
};
