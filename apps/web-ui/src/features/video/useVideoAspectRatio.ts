import { Ref, useEffect, useState, useMemo, RefObject } from "react";

export interface UseVideoAspectRatioProps {
  videoRef: RefObject<HTMLVideoElement> | null;
}

export type UseVideoAspectRatioReturnValue = {
  tailwindClass: string;
  ratio: number;
};

export const useVideoAspectRatio = ({
  videoRef,
}: UseVideoAspectRatioProps): UseVideoAspectRatioReturnValue => {
  const [tailwindClass, setTailwindClass] = useState<string>("aspect-video");
  const [ratio, setRatio] = useState(16 / 9);

  useEffect(() => {
    const video = (videoRef as UseVideoAspectRatioProps["videoRef"])?.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      const { videoWidth, videoHeight } = video;
      const aspect = videoWidth / videoHeight;

      // < 1 ? portrait : landscape
      setTailwindClass(aspect < 1 ? "aspect-[9/16]" : "aspect-video");
      setRatio(aspect);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [videoRef]);

  return useMemo(
    () => ({
      tailwindClass,
      ratio,
    }),
    [ratio, tailwindClass],
  );
};
