"use client";

import colors from "tailwindcss/colors";
import { RefObject, useEffect, useRef, useState } from "react";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.esm.js";
import { useSessionId } from "@/components/providers/session-id-provider";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import WaveSurfer from "wavesurfer.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";

export interface AudioVisualizerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export const AudioVisualizer = ({ videoRef }: AudioVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer>(null);
  const session = useSessionId();

  console.log("parent audio visualizer:::");

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("video ref from audio visualizer:::", videoRef);
  }, [videoRef]);

  // Wait for both to ensure the waveSurfer is created at the correct time
  useEffect(() => {
    if (containerRef.current && videoRef.current) {
      setIsReady(true);
    }
  }, [videoRef]);

  useEffect(() => {
    if (
      !isReady ||
      !containerRef.current ||
      !videoRef.current ||
      waveSurferRef.current
    ) {
      console.error("Audio Visualizer mounted without a necessary ref");
      return;
    }

    console.log("wavesurfer instance should be created");

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

    const timeout = setTimeout(() => {
      waveSurferRef.current = WaveSurfer.create({
        container: containerRef.current!,
        // height: 100,
        waveColor: colors.teal[500],
        progressColor: colors.teal[700],
        cursorWidth: 2,
        cursorColor: colors.white,
        media: videoRef.current!,
        normalize: true,
        autoCenter: true,
        dragToSeek: true,
        sampleRate: 16000,
        autoScroll: true,
        hideScrollbar: true,
        mediaControls: true,
        minPxPerSec: 100,
      });
    }, 200);

    return () => {
      clearTimeout(timeout);
      waveSurferRef?.current?.destroy();
      waveSurferRef.current = null;
    };
  }, [isReady, videoRef]);

  return (
    <div className="flex-1 h-full ">
      <div
        ref={containerRef}
        className="relative h-full overflow-y-hidden"
      />

      {/*<div className="flex justify-end items-center border-t-1">*/}
      {/*  <p className="mx-1 dark:text-white/55">18/75</p>*/}
      {/*</div>*/}
    </div>
  );
};
